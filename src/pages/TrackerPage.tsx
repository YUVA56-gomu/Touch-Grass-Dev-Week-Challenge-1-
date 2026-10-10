import React, { useEffect, useState, useCallback } from 'react';
import { defaultStorageEngine } from '../services/storage/StorageEngine';
import { OutdoorVisit, ActivitySummary, VisitFormData, IStorageEngine } from '../services/storage/types';
import { TrackerStatsHeader } from '../features/tracker/components/TrackerStatsHeader';
import { VisitCard } from '../features/tracker/components/VisitCard';
import { VisitFormModal } from '../features/tracker/components/VisitFormModal';
import { DeleteConfirmModal } from '../features/tracker/components/DeleteConfirmModal';
import { PixelButton } from '../components/pixel-ui/PixelButton';
import { PixelCard } from '../components/pixel-ui/PixelCard';
import { Compass, Plus, Trees, AlertCircle, RefreshCw } from 'lucide-react';
import '../features/tracker/TrackerPage.css';

interface TrackerPageProps {
  storageEngine?: IStorageEngine;
}

export const TrackerPage: React.FC<TrackerPageProps> = ({
  storageEngine = defaultStorageEngine,
}) => {
  const [visits, setVisits] = useState<OutdoorVisit[]>([]);
  const [summary, setSummary] = useState<ActivitySummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingVisit, setEditingVisit] = useState<OutdoorVisit | null>(null);
  const [deletingVisit, setDeletingVisit] = useState<OutdoorVisit | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setStorageError(null);
    try {
      await storageEngine.init();
      const fetchedVisits = await storageEngine.getVisits();
      const fetchedSummary = await storageEngine.getActivitySummary();
      setVisits(fetchedVisits);
      setSummary(fetchedSummary);
    } catch (err: any) {
      console.error('Failed to load outdoor visits from storage:', err);
      setStorageError(err.message || 'Unable to access local IndexedDB storage.');
    } finally {
      setIsLoading(false);
    }
  }, [storageEngine]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setEditingVisit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (visit: OutdoorVisit) => {
    setEditingVisit(visit);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingVisit(null);
  };

  const handleSaveVisit = async (formData: VisitFormData) => {
    if (editingVisit) {
      await storageEngine.updateVisit(editingVisit.id, formData);
    } else {
      await storageEngine.createVisit(formData);
    }
    await loadData();
  };

  const handleOpenDelete = (visit: OutdoorVisit) => {
    setDeletingVisit(visit);
  };

  const handleConfirmDelete = async () => {
    if (deletingVisit) {
      await storageEngine.deleteVisit(deletingVisit.id);
      setDeletingVisit(null);
      await loadData();
    }
  };

  return (
    <div className="tracker-page-container">
      {/* Hero Banner Header */}
      <div className="tracker-hero-banner">
        <div className="tracker-title-group">
          <h1>
            <Compass size={28} />
            Touch Grass Tracker
          </h1>
          <p className="tracker-subtitle">
            Log your outdoor visits, celebrate consecutive day streaks, and cherish your nature memories.
          </p>
        </div>

        <PixelButton variant="accent" onClick={handleOpenCreate} icon={<Plus size={18} />}>
          Log Outdoor Visit
        </PixelButton>
      </div>

      {/* Storage Error Alert */}
      {storageError && (
        <div className="form-error-alert" role="alert">
          <AlertCircle size={20} />
          <span>{storageError}</span>
          <PixelButton variant="ghost" size="sm" onClick={loadData}>
            <RefreshCw size={14} /> Retry
          </PixelButton>
        </div>
      )}

      {/* Statistics Header */}
      {summary && <TrackerStatsHeader summary={summary} />}

      {/* Journal Section */}
      <div className="journal-section-header">
        <h2 className="journal-section-title">Outdoor Memories Journal</h2>
        <PixelButton variant="ghost" size="sm" onClick={handleOpenCreate} icon={<Plus size={16} />}>
          New Entry
        </PixelButton>
      </div>

      {/* Journal Entries Grid / Empty State */}
      {isLoading ? (
        <PixelCard className="empty-journal-card">
          <p className="empty-text">Loading your outdoor memories...</p>
        </PixelCard>
      ) : visits.length === 0 ? (
        <PixelCard className="empty-journal-card">
          <Trees size={48} className="empty-mascot-icon" />
          <h3 className="empty-title">Your Outdoor Journal is Empty</h3>
          <p className="empty-text">
            Step outside, feel the crisp air, sit under a tree, or touch the grass! Log your first visit to begin your outdoor streak.
          </p>
          <PixelButton variant="primary" onClick={handleOpenCreate} icon={<Plus size={18} />}>
            Log Your First Visit
          </PixelButton>
        </PixelCard>
      ) : (
        <div className="visits-grid">
          {visits.map((visit) => (
            <VisitCard
              key={visit.id}
              visit={visit}
              storageEngine={storageEngine}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />
          ))}
        </div>
      )}

      {/* Form Dialog Modal */}
      <VisitFormModal
        isOpen={isFormOpen}
        editingVisit={editingVisit}
        storageEngine={storageEngine}
        onClose={handleCloseForm}
        onSave={handleSaveVisit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deletingVisit !== null}
        visit={deletingVisit}
        onClose={() => setDeletingVisit(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
