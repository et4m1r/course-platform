import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import rehypePrismPlus from 'rehype-prism-plus';
import "prism-themes/themes/prism-vs.css"

interface MarkdownRendererProps {
    content: string | null
}

function MarkdownRenderer({content}: MarkdownRendererProps) {
    if (!content) return null

    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, [rehypePrismPlus, {showLineNumbers: true}]]}
        >
            {content}
        </ReactMarkdown>
    )
}

export default MarkdownRenderer
