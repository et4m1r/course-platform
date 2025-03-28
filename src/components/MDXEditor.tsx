'use client'
import type {ForwardedRef} from 'react'
import {
    MDXEditor,
    UndoRedo,
    BoldItalicUnderlineToggles,
    toolbarPlugin,
    codeMirrorPlugin,
    BlockTypeSelect,
    ChangeCodeMirrorLanguage,
    codeBlockPlugin,
    CodeToggle,
    ConditionalContents,
    linkPlugin,
    InsertCodeBlock,
    InsertImage,
    imagePlugin,
    ListsToggle,
    listsPlugin,
    CreateLink,
    linkDialogPlugin,
    tablePlugin,
    InsertTable,
    thematicBreakPlugin,
    InsertThematicBreak,
    headingsPlugin,
    markdownShortcutPlugin,
    quotePlugin,
    type MDXEditorMethods,
    type MDXEditorProps
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'

export default function InitializedMDXEditor({
                                                 editorRef,
                                                 ...props
                                             }: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
    async function imageUploadHandler(image: File) {
        const formData = new FormData()
        formData.append('image', image)
        const response = await fetch('/api/uploads', {
            method: 'POST',
            body: formData
        })
        const json = (await response.json()) as { url: string }
        return json.url
    }

    // // Custom Button Component (Example)
    // const AlignmentButton = ({align, editor}: {
    //     align: 'left' | 'center' | 'right' | 'justify';
    //     editor: MDXEditorMethods | null
    // }) => {
    //     const handleClick = useCallback(() => {
    //         console.log(editor);
    //         if (editor) {
    //             const selection = editor.getSelection();
    //             if (selection) {
    //                 const [start, end] = selection;
    //                 const text = editor.getText(start, end);
    //
    //                 // Basic example: wrapping in a div with inline style
    //                 const replacement = `<div style="text-align: ${align};">${text}</div>`;
    //                 editor.replaceText(start, end, replacement);
    //             }
    //         }
    //     }, [align, editor]);
    //
    //     return <button onClick={handleClick}>Align {align}</button>; // You'd likely use a more visually appealing icon
    // };


    return (
        <div className="space-y-2 border border-gray-200 rounded-md min-h-72">
            <MDXEditor
                plugins={[
                    codeBlockPlugin({defaultCodeBlockLanguage: 'js'}),
                    codeMirrorPlugin({
                        codeBlockLanguages: {
                            js: 'JavaScript',
                            css: 'CSS',
                            html: 'HTML',
                            python: "python "
                        }
                    }),
                    linkPlugin(),
                    imagePlugin({imageUploadHandler}),
                    listsPlugin(),
                    linkDialogPlugin(),
                    thematicBreakPlugin(),
                    markdownShortcutPlugin(),
                    tablePlugin(),
                    headingsPlugin(),
                    quotePlugin(),
                    toolbarPlugin({
                        toolbarClassName: 'my-classname',
                        toolbarContents: () => (
                            <>
                                <ListsToggle/>
                                <UndoRedo/>
                                <BoldItalicUnderlineToggles/>
                                <BlockTypeSelect/>
                                <InsertImage/>
                                <CreateLink/>
                                <InsertTable/>
                                <InsertThematicBreak/>
                                <CodeToggle/>
                                {/*<AlignmentButton align="left" editor={editorInstance}/>*/}
                                {/*<AlignmentButton align="center" editor={editor}/>*/}
                                {/*<AlignmentButton align="right" editor={editorInstance}/>*/}
                                {/*<AlignmentButton align="justify" editor={editor}/>*/}
                                <ConditionalContents
                                    options={[
                                        {
                                            when: (editor) => editor?.editorType === 'codeblock',
                                            contents: () => <ChangeCodeMirrorLanguage/>
                                        },
                                        {
                                            fallback: () => (
                                                <>
                                                    <InsertCodeBlock/>
                                                </>
                                            )
                                        }
                                    ]}
                                />
                            </>
                        )
                    })
                ]}
                {...props}
                ref={editorRef}
            />
        </div>
    )
}

