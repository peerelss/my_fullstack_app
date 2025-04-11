'use client'
import {useEffect, useState } from 'react'
import FolderBrowser from '@/components/FolderBrowser'
import Gallery from '@/components/Gallery'

export default function Home() {
  const [selectedFolder, setSelectedFolder] = useState('d:\\')

  return (
    <div style={{ display: 'flex' }}>
     <div style={{ width: 600, borderRight: '1px solid #ccc', padding: 8 }}>
        <FolderBrowser onSelect={setSelectedFolder} />
      </div>
      <div style={{ flex: 1 }}>
        <Gallery folder={selectedFolder} />
      </div>
    </div>
  )
}
