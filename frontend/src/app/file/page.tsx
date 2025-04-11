'use client'
import { useEffect, useState } from 'react'

type FolderNode = {
  id: string // 完整路径，例如 D:/folder1
  label: string // 显示名称，例如 folder1
  children?: FolderNode[]
  open?: boolean
}

async function fetchSubdirs(path: string): Promise<FolderNode[]> {
  const res = await fetch(`/api/subdirs?path=${encodeURIComponent(path)}`)
  const data = await res.json()
  return data.subdirectories || []
}

function FolderItem({
  node,
  onToggle,
  onSelect,
  level = 0,
}: {
  node: FolderNode
  onToggle: (node: FolderNode) => void
  onSelect: (path: string) => void
  level?: number
}) {
  return (
    <div style={{ paddingLeft: 12 * level }}>
      <button onClick={() => onToggle(node)} style={{ marginRight: 4 }}>
        {node.open ? '-' : '+'}
      </button>
      <span
        onClick={() => onSelect(node.id)}
        style={{ cursor: 'pointer', color: 'blue' }}
      >
        {node.label}
      </span>
      {node.open && node.children?.map((child) => (
        <FolderItem
          key={child.id}
          node={child}
          onToggle={onToggle}
          onSelect={onSelect}
          level={level + 1}
        />
      ))}
    </div>
  )
}

export default function FolderBrowser({
  rootPath = 'D:/',
  onSelect,
}: {
  rootPath?: string
  onSelect: (path: string) => void
}) {
  const [folders, setFolders] = useState<FolderNode[]>([])

  useEffect(() => {
    fetchSubdirs(rootPath).then((list) =>
      setFolders(list.map((item) => ({ ...item, open: false })))
    )
  }, [rootPath])

  const toggleNode = async (node: FolderNode) => {
    if (!node.open && node.children === undefined) {
      const children = await fetchSubdirs(node.id)
      node.children = children.map((item) => ({ ...item, open: false }))
    }
    node.open = !node.open
    setFolders([...folders])
  }

  return (
    <div>
      {folders.map((node) => (
        <FolderItem
          key={node.id}
          node={node}
          onToggle={toggleNode}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
