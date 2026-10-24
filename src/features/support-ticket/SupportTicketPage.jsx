import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/navigation/PageHeader.jsx';
import { DataTable, MobileRecordCard } from '../../components/tables/DataTable.jsx';
import { TablePageWorkspace } from '../../components/tables/TablePageWorkspace.jsx';
import { FilterBar } from '../../components/tables/FilterBar.jsx';
import { Drawer, DrawerSection } from '../../components/overlays/Drawer.jsx';
import { Button } from '../../components/forms/Button.jsx';
import { DateRangeFilter } from '../../components/forms/DateRangeFilter.jsx';
import { Textarea, TextInput } from '../../components/forms/TextInput.jsx';
import { Select, CompactSelect } from '../../components/forms/Select.jsx';
import { StatusBadge, PriorityBadge } from '../../components/data-display/StatusBadge.jsx';
import { mockApi } from '../../services/mockApi.js';
import { useToast } from '../../components/feedback/Toast.jsx';
import { Headphones, Eye, MessageSquare, Send, CheckCircle2, User, Clock } from 'lucide-react';

export const SupportTicketPage = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [newStatus, setNewStatus] = useState('In Progress');
  const [isReplying, setIsReplying] = useState(false);
  const { addToast } = useToast();

  const statusTabs = [
    { id: 'All', label: 'All Tickets', count: 6 },
    { id: 'Open', label: 'Open', count: 2 },
    { id: 'In Progress', label: 'In Progress', count: 2 },
    { id: 'Resolved', label: 'Resolved', count: 1 },
    { id: 'Closed', label: 'Closed', count: 1 },
  ];

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await mockApi.getSupportTickets({
        status: statusFilter,
        search: searchTerm,
        fromDate,
        toDate,
      });
      setTickets(res.items);
    } catch (err) {
      addToast('Failed to load support tickets.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter, searchTerm, fromDate, toDate]);

  const handleOpenTicket = (ticket) => {
    setSelectedTicket(ticket);
    setNewStatus(ticket.status);
    setReplyMessage('');
    setIsDrawerOpen(true);
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) {
      addToast('Please enter an official response message.', 'error');
      return;
    }

    try {
      setIsReplying(true);
      const updated = await mockApi.replySupportTicket(
        selectedTicket.id,
        replyMessage,
        newStatus
      );
      setSelectedTicket(updated);
      setTickets((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      setReplyMessage('');
      addToast(`Response recorded for Ticket #${selectedTicket.ticketNumber}.`, 'success');
    } catch (err) {
      addToast('Failed to post reply.', 'error');
    } finally {
      setIsReplying(false);
    }
  };

  const columns = [
    { key: 'sl', title: 'SL', width: '60px', isMono: true },
    {
      key: 'ticketNumber',
      title: 'Ticket ID',
      isMono: true,
      render: (val, row) => (
        <div className="flex flex-col">
          <p className="font-mono font-bold text-[var(--color-text-primary)]">{val}</p>
          <p className="type-meta text-[var(--color-text-secondary)] font-sans truncate">{row.category}</p>
        </div>
      ),
    },
    {
      key: 'subject',
      title: 'Subject / Description',
      render: (val, row) => (
        <div className="flex flex-col max-w-sm">
          <p className="font-semibold text-[var(--color-text-primary)] truncate">{val}</p>
          <p className="type-meta text-[var(--color-text-muted)] truncate">{row.description}</p>
        </div>
      ),
    },
    {
      key: 'submittedBy',
      title: 'Submitted By',
      render: (val, row) => (
        <div className="flex flex-col">
          <p className="font-medium text-[var(--color-text-primary)]">{val}</p>
          <p className="type-meta text-[var(--color-text-muted)] font-mono">{row.phone}</p>
        </div>
      ),
    },
    {
      key: 'priority',
      title: 'Priority',
      width: '100px',
      render: (val) => <PriorityBadge priority={val} />,
    },
    {
      key: 'status',
      title: 'Status',
      width: '110px',
      render: (val) => <StatusBadge status={val} size="sm" />,
    },
    {
      key: 'date',
      title: 'Date',
      isMono: true,
      width: '110px',
      render: (val) => <p className="type-meta text-[var(--color-text-secondary)] font-mono">{val}</p>,
    },
    {
      key: 'actions',
      title: 'Action',
      width: '110px',
      render: (_, row) => (
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => handleOpenTicket(row)}
          className="type-meta h-7.5 px-2.5"
        >
          Inspect
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Support Ticket"
        breadcrumbs={[
          { label: 'Support Ticket' }
        ]}
      />

      

      <TablePageWorkspace
        title="Support Tickets"
        count={statusTabs.find((tab) => tab.id === statusFilter)?.count ?? tickets.length}
        tabs={statusTabs}
        activeTab={statusFilter}
        onTabChange={(id) => {
          setStatusFilter(id);
        }}
        toolbar={
          <FilterBar embedded
                  searchPlaceholder="Search tickets..."
                  searchValue={searchTerm}
                  searchSuggestions={tickets.flatMap((ticket) => [ticket.ticketNumber, ticket.submittedBy, ticket.phone, ticket.imei, ticket.subject])}
                  onSearchChange={setSearchTerm}
                  dateFilter={
                    <DateRangeFilter
                      compact
                      className="shrink-0"
                      startDate={fromDate}
                      endDate={toDate}
                      onStartDateChange={setFromDate}
                      onEndDateChange={setToDate}
                    />
                  }
                />
        }
      >
        <DataTable embedded
                columns={columns}
                data={tickets}
                isLoading={isLoading}
          pagination
                onRowClick={handleOpenTicket}
                renderMobileCard={(row) => (
                  <MobileRecordCard
                    title={row.ticketNumber}
                    subtitle={row.subject}
                    status={row.status}
                    fields={[
                      { label: 'Submitted By', value: row.submittedBy },
                      { label: 'Phone', value: row.phone, isMono: true },
                      { label: 'Priority', value: row.priority },
                      { label: 'Date', value: row.date, isMono: true },
                    ]}

                  />
                )}
              />
      </TablePageWorkspace>

      {/* Support Ticket Details & Message History Drawer */}
      {selectedTicket && (
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
          onExited={() => {
            setSelectedTicket(null);
          }}
          title={`Ticket #${selectedTicket.ticketNumber}`}
          subtitle={selectedTicket.subject}
          headerStatus={
            <div className="flex items-center gap-2">
              <PriorityBadge priority={selectedTicket.priority} />
              <StatusBadge status={selectedTicket.status} size="sm" />
            </div>
          }
          width="w-full sm:w-[600px]"
        >
          <div className="border border-[var(--color-border)] rounded-[var(--field-radius)] overflow-hidden bg-[var(--color-surface)]">
            <DrawerSection title="Ticket Information">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 pt-1">
                <div>
                  <p className="type-meta text-[var(--color-text-secondary)]">Citizen</p>
                  <p className="type-body-sm font-medium text-[var(--color-text-primary)] mt-0.5">{selectedTicket.submittedBy}</p>
                </div>
                <div>
                  <p className="type-meta text-[var(--color-text-secondary)]">Phone</p>
                  <p className="type-body-sm font-medium font-mono text-[var(--color-text-primary)] mt-0.5">{selectedTicket.phone}</p>
                </div>
                <div>
                  <p className="type-meta text-[var(--color-text-secondary)]">Category</p>
                  <p className="type-body-sm font-medium text-[var(--color-text-primary)] mt-0.5">{selectedTicket.category}</p>
                </div>
                {selectedTicket.imei && (
                  <div>
                    <p className="type-meta text-[var(--color-text-secondary)]">Linked IMEI</p>
                    <p className="type-body-sm font-medium font-mono text-[var(--color-primary-dark)] mt-0.5">{selectedTicket.imei}</p>
                  </div>
                )}
              </div>
            </DrawerSection>
          </div>

          {/* Conversation History Thread */}
          <div className="border border-[var(--color-border)] rounded-[var(--field-radius)] overflow-hidden bg-[var(--color-surface)]">
            <DrawerSection title="Conversation">
              <div className="space-y-3">
              {selectedTicket.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-3.5 rounded-lg border type-body-sm ${
                    msg.isStaff
                      ? 'bg-[var(--color-background-subtle)] border-[var(--color-border)] sm:ml-4'
                      : 'bg-[var(--color-surface)] border-[var(--color-border)] sm:mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-[var(--color-border-subtle)]">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <p className="type-body-sm font-semibold text-[var(--color-text-primary)] truncate">{msg.sender}</p>
                      {msg.isStaff && <p className="type-badge bg-[var(--color-primary)] text-white px-2 py-0.5 rounded-full font-medium">Staff</p>}
                    </div>
                    <p className="type-meta text-[var(--color-text-muted)] font-mono shrink-0">{msg.timestamp}</p>
                  </div>
                  <p className="type-body-sm text-[var(--color-text-primary)]">{msg.content}</p>
                </div>
              ))}
              </div>
            </DrawerSection>
          </div>

          {/* Reply Form */}
          <div className="border border-[var(--color-border)] rounded-[var(--field-radius)] overflow-hidden bg-[var(--color-surface)]">
            <DrawerSection title="Response">
              <form onSubmit={handleSendReply} className="space-y-4 pt-1">
            <div className="flex justify-end">
              <div className="w-40">
                <CompactSelect
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  options={[
                    { value: 'In Progress', label: 'In Progress' },
                    { value: 'Resolved', label: 'Resolved' },
                    { value: 'Closed', label: 'Closed' },
                  ]}
                  placeholder=""
                  aria-label="Ticket status"
                />
              </div>
            </div>

            <Textarea
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Write response..."
              rows={3}
              required
            />

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="primary"
                icon={Send}
                isLoading={isReplying}
              >
                Send Response
              </Button>
            </div>
              </form>
            </DrawerSection>
          </div>
        </Drawer>
      )}
    </div>
  );
};
