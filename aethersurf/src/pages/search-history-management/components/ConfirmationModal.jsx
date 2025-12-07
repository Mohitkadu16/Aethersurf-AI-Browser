import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "default" // default, destructive, warning
}) => {
  if (!isOpen) return null;

  const getIconAndColor = () => {
    switch (type) {
      case 'destructive':
        return { icon: 'AlertTriangle', color: 'var(--color-destructive)' };
      case 'warning':
        return { icon: 'AlertCircle', color: 'var(--color-warning)' };
      default:
        return { icon: 'HelpCircle', color: 'var(--color-primary)' };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1100 p-4">
      <div className="bg-popover border border-light rounded-lg shadow-elevated max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-full ${
              type === 'destructive' ? 'bg-destructive/10' : 
              type === 'warning' ? 'bg-warning/10' : 'bg-primary/10'
            }`}>
              <Icon name={icon} size={24} color={color} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">
              {title}
            </h3>
          </div>

          {/* Message */}
          <p className="text-text-secondary mb-6 leading-relaxed">
            {message}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              {cancelText}
            </Button>
            <Button
              variant={type === 'destructive' ? 'destructive' : 'default'}
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;