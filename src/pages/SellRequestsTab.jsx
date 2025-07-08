import React from 'react';
import SellRequestsTable from '../components/admin/SellRequestsTable';

const SellRequestsTab = ({
  requests,
  loading,
  pagination,
  statusFilter,
  searchTerm,
  onStatusFilterChange,
  onSearch,
  onPageChange,
  onOpenModal,
  onUpdateStatus
}) => {
  return (
    <SellRequestsTable
      requests={requests}
      loading={loading}
      pagination={pagination}
      statusFilter={statusFilter}
      searchTerm={searchTerm}
      onStatusFilterChange={onStatusFilterChange}
      onSearch={(e) => onSearch(e.target.value)}
      onPageChange={onPageChange}
      onOpenModal={onOpenModal}
      onUpdateStatus={onUpdateStatus}
      onDelete={(id) => {
        if (window.confirm("Are you sure you want to delete this request?")) {
          console.log("Delete request:", id);
        }
      }}
    />
  );
};

export default SellRequestsTab;
