import { ThemePreview } from '@/components/ui/theme-preview'

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-bold">Theme Configuration</h1>
        <ThemePreview />
      </div>
    </div>
  )
}
