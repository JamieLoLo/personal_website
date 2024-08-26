import rehypeHighlight from 'rehype-highlight'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import '../../app/markdownStyle.css'
import 'highlight.js/styles/github.css'

export default function CreatePreview({ content, viewMode }) {
  return (
    <div
      className={`h-full whitespace-pre-wrap overflow-y-scroll overscroll-none ${
        viewMode === 'preview' ? 'w-[700px]' : 'w-full'
      }`}
    >
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        remarkPlugins={[remarkGfm]}
        className='markdown-body'
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
