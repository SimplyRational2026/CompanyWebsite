import { redirect } from 'next/navigation'

// Any URL that doesn't match a real route (`/`, `/impressum`, `/datenschutz`)
// lands here and gets redirected to the homepage.
export default function NotFound() {
  redirect('/')
}
