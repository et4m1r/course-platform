import {PageHeader} from "@/components/PageHeader"
import {LessonForm} from "@/features/lessons/components/LessonForm";
import {cacheTag} from "next/dist/server/use-cache/cache-tag";
import {getCourseIdTag} from "@/features/courses/db/cache/courses";
import {getCourseSectionCourseTag} from "@/features/courseSections/db/cache";
import {getLessonCourseTag} from "@/features/lessons/db/cache/lessons";
import {db} from "@/drizzle/db";
import {asc, eq} from "drizzle-orm";
import {CourseTable} from "@/drizzle/schema/course";
import {CourseSectionTable} from "@/drizzle/schema/courseSection";
import {LessonTable} from "@/drizzle/schema/lesson";

import {notFound} from "next/navigation"

export default async function NewCoursePage({
                                                params,
                                            }: {
    params: Promise<{ courseId: string }>
}) {
    const {courseId} = await params
    const course = await getCourse(courseId)
    // const { query } = useRouter();
    // const courseId = query.courseId as string;
    if (!course) {
        notFound();
    }
    return (
        <div className="container my-6">
            <PageHeader title="New Lesson"/>
            <LessonForm
                sections={course.courseSections}
                // onSuccess={}
                // lesson={}
                // defaultSectionId={}
            />
        </div>
    )
}

async function getCourse(id: string) {
    "use cache"
    cacheTag(
        getCourseIdTag(id),
        getCourseSectionCourseTag(id),
        getLessonCourseTag(id)
    )

    return db.query.CourseTable.findFirst({
        columns: {id: true, name: true, description: true},
        where: eq(CourseTable.id, id),
        with: {
            courseSections: {
                orderBy: asc(CourseSectionTable.order),
                columns: {id: true, status: true, name: true},
                with: {
                    lessons: {
                        orderBy: asc(LessonTable.order),
                        columns: {
                            id: true,
                            name: true,
                            status: true,
                            description: true,
                            sectionId: true,
                        },
                    },
                },
            },
        },
    })
}