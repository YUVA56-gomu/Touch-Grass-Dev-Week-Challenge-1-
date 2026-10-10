import React, { useState, useEffect, useRef } from 'react';
import { OutdoorVisit, VisitFormData, IStorageEngine } from '../../../services/storage/types';
import { PixelButton } from '../../../components/pixel-ui/PixelButton';
import { PixelCard } from '../../../components/pixel-ui/PixelCard';
import { X, Upload, Calendar, Clock, MapPin, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { getLocalDateString } from '../../../services/storage/streakUtils';

interface VisitFormModalProps {
  isOpen: boolean;
  editingVisit: OutdoorVisit | null;
  storageEngine: IStorageEngine;
  onClose: () => void;
  onSave: (formData: VisitFormData) => Promise<void>;
}

const MAX_PHOTO_SIZE_MB = 5;

export const VisitFormModal: React.FC<VisitFormModalProps> = ({
  isOpen,
  editingVisit,
  storageEngine,
  onClose,
  onSave,
}) => {
  const [dateString, setDateString] = useState<string>(getLocalDateString());
  const [durationMinutes, setDurationMinutes] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeExistingPhoto, setRemoveExistingPhoto] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate or reset form fields on open / edit change
  useEffect(() => {
    if (!isOpen) return;

    setFormError(null);
    setIsSubmitting(false);
    setPhotoFile(null);
    setRemoveExistingPhoto(false);

    if (editingVisit) {
      setDateString(editingVisit.dateString || getLocalDateString(editingVisit.timestamp));
      setDurationMinutes(editingVisit.durationMinutes ? String(editingVisit.durationMinutes) : '');
      setLocationName(editingVisit.locationName || '');
      setNotes(editingVisit.notes || '');

      if (editingVisit.photoBlobId) {
        storageEngine
          .getPhotoBlob(editingVisit.photoBlobId)
          .then((blob) => {
            if (blob) {
              setPreviewUrl(URL.createObjectURL(blob));
            } else {
              setPreviewUrl(null);
            }
          })
          .catch(() => setPreviewUrl(null));
      } else {
        setPreviewUrl(null);
      }
    } else {
      setDateString(getLocalDateString());
      setDurationMinutes('');
      setLocationName('');
      setNotes('');
      setPreviewUrl(null);
    }
  }, [isOpen, editingVisit, storageEngine]);

  // Clean up Object URL previews
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      setFormError(`File size exceeds limit (${(file.size / 1024 / 1024).toFixed(1)}MB > 5MB limit).`);
      return;
    }

    if (file.type && !file.type.startsWith('image/')) {
      setFormError('Only image files (JPEG, PNG, WebP, GIF) are allowed.');
      return;
    }

    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    setPhotoFile(file);
    setRemoveExistingPhoto(false);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPhotoFile(null);
    setPreviewUrl(null);
    setRemoveExistingPhoto(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!dateString) {
      setFormError('Please select a valid date for your outdoor visit.');
      return;
    }

    let parsedDuration: number | undefined = undefined;
    if (durationMinutes.trim()) {
      parsedDuration = parseInt(durationMinutes, 10);
      if (isNaN(parsedDuration) || parsedDuration <= 0) {
        setFormError('Duration must be a positive number of minutes.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSave({
        dateString,
        durationMinutes: parsedDuration,
        locationName,
        notes,
        photoFile,
        removeExistingPhoto,
      });
      onClose();
    } catch (err: any) {
      console.error('Save visit failed:', err);
      setFormError(err.message || 'Failed to save visit record. Input preserved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <PixelCard
          title={editingVisit ? 'Edit Outdoor Memory' : 'Log Outdoor Visit'}
          subtitle={editingVisit ? 'Update your journal entry' : 'Step outside and record your nature break'}
          className="visit-form-card"
        >
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>

          {formError && (
            <div className="form-error-alert">
              <AlertCircle size={18} />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="visit-form">
            {/* Date Picker */}
            <div className="form-group">
              <label htmlFor="visit-date" className="form-label">
                <Calendar size={16} />
                Date of Visit
              </label>
              <input
                id="visit-date"
                type="date"
                value={dateString}
                onChange={(e) => setDateString(e.target.value)}
                className="pixel-input"
                required
              />
            </div>

            {/* Duration & Location Row */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="visit-duration" className="form-label">
                  <Clock size={16} />
                  Duration (mins)
                </label>
                <input
                  id="visit-duration"
                  type="number"
                  min="1"
                  max="1440"
                  placeholder="e.g. 30"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="pixel-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="visit-location" className="form-label">
                  <MapPin size={16} />
                  Location Label
                </label>
                <input
                  id="visit-location"
                  type="text"
                  placeholder="e.g. Greenwood Park"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="pixel-input"
                />
              </div>
            </div>

            {/* Reflections Notes */}
            <div className="form-group">
              <label htmlFor="visit-notes" className="form-label">
                Reflections & Notes
              </label>
              <textarea
                id="visit-notes"
                rows={3}
                placeholder="What did you observe? How did the grass, trees, or sunlight feel?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="pixel-textarea"
              />
            </div>

            {/* Optional Photo Upload */}
            <div className="form-group">
              <label className="form-label">
                <ImageIcon size={16} />
                Memory Photo (Optional)
              </label>

              {previewUrl ? (
                <div className="photo-preview-box">
                  <img src={previewUrl} alt="Selected preview" className="photo-preview pixel-art" />
                  <PixelButton
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePhoto}
                    className="remove-photo-btn"
                  >
                    Remove Photo
                  </PixelButton>
                </div>
              ) : (
                <div className="photo-file-picker">
                  <input
                    type="file"
                    id="photo-input"
                    ref={fileInputRef}
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleFileChange}
                    className="photo-input-hidden"
                  />
                  <label htmlFor="photo-input" className="photo-upload-label">
                    <Upload size={18} />
                    <span>Choose a Photo (Max 5MB)</span>
                  </label>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="form-actions">
              <PixelButton type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </PixelButton>
              <PixelButton type="submit" variant="primary" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingVisit ? 'Save Changes' : 'Record Visit'}
              </PixelButton>
            </div>
          </form>
        </PixelCard>
      </div>
    </div>
  );
};
