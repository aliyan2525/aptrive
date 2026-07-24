import type { BlogContentBlock } from "@/lib/blog-data";

export default function PostBody({ blocks }: { blocks: BlogContentBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={index} className="font-display mt-8 text-xl font-semibold text-fg">
                {block.text}
              </h2>
            );
          case "list":
            return (
              <ul key={index} className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted">
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={index}
                className="rounded-sm border-l-2 border-teal bg-teal-dim px-5 py-4 text-sm italic leading-relaxed text-fg"
              >
                &ldquo;{block.text}&rdquo;
                {block.cite && <footer className="mt-2 text-xs not-italic text-muted">{block.cite}</footer>}
              </blockquote>
            );
          case "paragraph":
          default:
            return (
              <p key={index} className="text-sm leading-relaxed text-muted">
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
