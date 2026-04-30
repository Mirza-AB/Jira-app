import { Outlet } from 'react-router-dom'

function AppShell() {
  return (
    <div>
      <header>
        <h1>Jira Clone</h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AppShell
