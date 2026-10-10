import React from 'react';
import { OutdoorVisit } from '../../../services/storage/types';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  visit: OutdoorVisit | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  visit,
  onClose,
  onConfirm,
}) => {
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  if (!isOpen || !visit) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error('Delete failed:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="delete-dialog-title">
      <div className="modal-container delete-modal" onClick={(e) => e.stopPropagation()}>
        <PixelCard title="Delete Outdoor Memory?" className="delete-card">
          <div className="delete-warning-content">
            <AlertTriangle size={32} className="warning-icon" />
            <p className="delete-message">
              Are you sure you want to remove the outdoor visit from{' '}
              <strong>{visit.dateString}</strong>
              {visit.locationName ? ` at ${visit.locationName}` : ''}?
            </p>
            <p className="delete-subtext">This action will update your streak stats and cannot be undone.</p>
          </div>

          <div className="form-actions">
            <PixelButton type="button" variant="secondary" onClick={onClose} disabled={isDeleting}>
              Cancel
            </PixelButton>
            <PixelButton type="button" variant="accent" onClick={handleConfirm} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Yes, Delete Visit'}
            </PixelButton>
          </div>
        </PixelCard>
      </div>
    </div>
  );
};
