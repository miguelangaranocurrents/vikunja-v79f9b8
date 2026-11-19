import type {Node as ProseNode, Slice} from '@tiptap/pm/model'

const LIST_NODE_NAMES = new Set(['bulletList', 'orderedList', 'taskList'])

// Appends the plain-text lines for a node. Textblocks become one line each, list items get
// a marker ("- " or "1. ") on their first line, so copied lists keep their structure.
function appendBlockText(node: ProseNode, prefix: string, lines: string[]) {
	if (node.isTextblock) {
		lines.push(prefix + node.textContent)
		return
	}

	if (LIST_NODE_NAMES.has(node.type.name)) {
		let number = 1
		node.forEach(item => {
			const marker = node.type.name === 'orderedList' ? `${number++}. ` : '- '
			let first = true
			item.forEach(child => {
				appendBlockText(child, first ? prefix + marker : prefix + '  ', lines)
				first = false
			})
		})
		return
	}

	node.forEach(child => appendBlockText(child, prefix, lines))
}

// Plain-text clipboard representation of an editor selection, used by ProseMirror for copy and cut.
export function sliceToPlainText(slice: Slice): string {
	const lines: string[] = []
	slice.content.forEach(node => appendBlockText(node, '', lines))
	return lines.join('\n')
}
