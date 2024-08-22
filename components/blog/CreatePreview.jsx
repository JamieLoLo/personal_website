import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

export default function CreatePreview({ content, mode }) {
  return (
    <div
      className={`h-full whitespace-pre-wrap ${
        mode === 'preview' ? 'w-[700px]' : 'w-full'
      }`}
    >
      <ReactMarkdown children={content} rehypePlugins={[rehypeRaw]} />
    </div>
  )
}
