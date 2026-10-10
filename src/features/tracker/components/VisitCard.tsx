import React, { useEffect, useState } from 'react';
import { OutdoorVisit, IStorageEngine } from '../../../services/storage/types';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { MapPin, Clock, Edit2, Trash2, Calendar, Image as ImageIcon } from 'lucide-react';
import { parseLocalDateString } from '../../../services/storage/streakUtils';

interface VisitCardProps {
  visit: OutdoorVisit;
  storageEngine: IStorageEngine;
  onEdit: (visit: OutdoorVisit) => void;
  onDelete: (visit: OutdoorVisit) => void;
}

export const VisitCard: React.FC<VisitCardProps> = ({
  visit,
  storageEngine,
  onEdit,
  onDelete,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoLoading, setPhotoLoading] = useState<boolean>(false);
  const [photoError, setPhotoError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let createdUrl: string | null = null;

    if (visit.photoBlobId) {
      setPhotoLoading(true);
      setPhotoError(false);
      storageEngine
        .getPhotoBlob(visit.photoBlobId)
        .then((blob) => {
          if (isMounted && blob) {
            createdUrl = URL.createObjectURL(blob);
            setPhotoUrl(createdUrl);
          }
        })
        .catch((err) => {
          console.warn('Failed to load visit photo blob:', err);
          if (isMounted) setPhotoError(true);
        })
        .finally(() => {
          if (isMounted) setPhotoLoading(false);
        });
    } else {
      setPhotoUrl(null);
    }

    return () => {
      isMounted = false;
      if (createdUrl) {
        URL.revokeObjectURL(createdUrl);
      }
    };
  }, [visit.photoBlobId, storageEngine]);

  const formattedDate = React.useMemo(() => {
    try {
      const d = parseLocalDateString(visit.dateString);
      return d.toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return visit.dateString;
    }
  }, [visit.dateString]);

  return (
    <PixelCard className="visit-card" interactive={false}>
      <div className="visit-card-header">
        <div className="visit-date-badge">
          <Calendar size={16} />
          <span>{formattedDate}</span>
        </div>

        <div className="visit-card-actions">
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={() => onEdit(visit)}
            aria-label={`Edit visit from ${formattedDate}`}
          >
            <Edit2 size={15} />
          </PixelButton>
          <PixelButton
            variant="ghost"
            size="sm"
            onClick={() => onDelete(visit)}
            aria-label={`Delete visit from ${formattedDate}`}
          >
            <Trash2 size={15} />
          </PixelButton>
        </div>
      </div>

      {visit.locationName && (
        <div className="visit-location">
          <MapPin size={16} className="location-icon" />
          <span>{visit.locationName}</span>
        </div>
      )}

      {visit.durationMinutes && visit.durationMinutes > 0 && (
        <div className="visit-duration-pill">
          <Clock size={14} />
          <span>{visit.durationMinutes} mins outdoors</span>
        </div>
      )}

      {visit.notes && <p className="visit-notes">{visit.notes}</p>}

      {visit.photoBlobId && (
        <div className="visit-photo-container">
          {photoLoading && (
            <div className="photo-placeholder loading">
              <ImageIcon size={20} className="spin" />
              <span>Loading photo...</span>
            </div>
          )}
          {photoError && (
            <div className="photo-placeholder error">
              <span>Photo could not be loaded</span>
            </div>
          )}
          {photoUrl && !photoLoading && !photoError && (
            <img
              src={photoUrl}
              alt={`Outdoor memory from ${formattedDate}`}
              className="visit-photo pixel-art"
              onError={() => setPhotoError(true)}
            />
          )}
        </div>
      )}
    </PixelCard>
  );
};
