"use client"

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {z} from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {RequiredLabelIcon} from "@/components/RequiredLabelIcon"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {actionToast} from "@/hooks/use-toast"
import {LessonStatus, lessonStatuses} from "@/drizzle/schema"
import {
    Select,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectContent,
} from "@/components/ui/select"
import {lessonSchema} from "../schemas/lessons"
import {createLesson, updateLesson} from "../actions/lessons"

import {ForwardRefEditor} from "@/components/ClientMDXEditor";

export function LessonForm({
                               sections,
                               defaultSectionId,
                               onSuccess,
                               lesson,
                           }: {
    sections: {
        id: string
        name: string
    }[]
    onSuccess?: () => void
    defaultSectionId?: string
    lesson?: {
        id: string
        name: string
        status: LessonStatus
        description: string | null
        sectionId: string
    }
}) {
    const form = useForm<z.infer<typeof lessonSchema>>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: lesson?.name ?? "",
            status: lesson?.status ?? "public",
            description: lesson?.description ?? "",
            sectionId: lesson?.sectionId ?? defaultSectionId ?? sections[0]?.id ?? "",
        },
    })

    async function onSubmit(values: z.infer<typeof lessonSchema>) {
        const action =
            lesson == null ? createLesson : updateLesson.bind(null, lesson.id)
        const data = await action(values)
        actionToast({actionData: data})
        if (!data.error) onSuccess?.()
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-6 flex-col @container"
            >
                <div className="grid grid-cols-1 @lg:grid-cols-3 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>
                                    <RequiredLabelIcon/>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="sectionId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Section</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {sections.map(section => (
                                            <SelectItem key={section.id} value={section.id}>
                                                {section.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {lessonStatuses.map(status => (
                                            <SelectItem key={status} value={status}>
                                                {status}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                {/*<Textarea*/}
                                {/*  className="min-h-20 resize-none"*/}
                                {/*  {...field}*/}
                                {/*  value={field.value ?? ""}*/}
                                {/*/>*/}
                                {/*  <MDXEditor*/}
                                {/*      className="border rounded-md p-2 min-h-40"*/}
                                {/*      contentEditableClassName="p-2 outline-none"*/}
                                {/*      markdown={field.value ?? ""}*/}
                                {/*      onChange={field.onChange}*/}
                                {/*      placeholder="Write your lesson description here..."*/}
                                {/*  />*/}


                                <ForwardRefEditor className="min-h-240 resize-none" markdown={field.value ?? ""}
                                                  onChange={field.onChange}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="self-end">
                    <Button disabled={form.formState.isSubmitting} type="submit">
                        Save
                    </Button>
                </div>
            </form>
        </Form>
    )
}
