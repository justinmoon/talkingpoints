import React from "react"
import useSWR from "swr"

import DashboardShell from "components/DashboardShell"
import EmptyState from "components/EmptyState"
import SiteTable from "components/SiteTable"
import SiteTableSkeleton from "components/SiteTableSkeleton"
import SiteTableHeader from "components/SiteTableHeader"
import fetcher from "utils/fetcher"
import { useAuth } from "utils/auth"

const Dashboard = () => {
  const { user } = useAuth()

  const { data } = useSWR(user ? ["/api/sites", user.token] : null, fetcher)
  const sites = data?.sites

  if (!data) {
    return (
      <DashboardShell>
        <SiteTableHeader />
        <SiteTableSkeleton />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <SiteTableHeader />
      {sites.length ? <SiteTable sites={sites} /> : <EmptyState />}
    </DashboardShell>
  )
}

export default Dashboard
