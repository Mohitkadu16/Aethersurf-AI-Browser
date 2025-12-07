import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { jsPDF } from 'jspdf';
import { Document, Paragraph, Packer } from 'docx';
import { saveAs } from 'file-saver';

const BulkActionBar = ({ 
  selectedCount, 
  onSelectAll, 
  onDeselectAll, 
  onBulkDelete, 
  onBulkExport, 
  onBulkFavorite,
  totalCount,
  allSelected 
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    { id: 'txt', label: 'Text File (.txt)', icon: 'FileText' },
    { id: 'pdf', label: 'PDF Document (.pdf)', icon: 'FilePdf' },
    { id: 'docx', label: 'Word Document (.docx)', icon: 'FileWord' },
    { id: 'json', label: 'JSON File (.json)', icon: 'FileJson' }
  ];

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      const currentDate = new Date();
      const exportData = {
        exportDate: currentDate.toLocaleDateString(),
        exportTime: currentDate.toLocaleTimeString(),
        selectedCount,
        timestamp: currentDate.toISOString()
      };

      let blob;
      switch (format) {
        case 'txt': {
          const content = [
            'Bulk Export Report',
            '----------------',
            `Export Date: ${exportData.exportDate}`,
            `Export Time: ${exportData.exportTime}`,
            `Items Selected: ${exportData.selectedCount}`,
            '----------------'
          ].join('\n');
          blob = new Blob([content], { type: 'text/plain' });
          break;
        }
        case 'json': {
          const data = {
            reportType: 'Bulk Export Report',
            metadata: exportData
          };
          blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
          break;
        }
        case 'pdf': {
          const pdf = new jsPDF();
          
          // Add header
          pdf.setFillColor(240, 240, 240);
          pdf.rect(0, 0, pdf.internal.pageSize.width, 40, 'F');
          
          // Title
          pdf.setFontSize(20);
          pdf.setTextColor(40, 40, 40);
          pdf.text('Bulk Export Report', 20, 25);
          
          // Content
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(12);
          
          const startY = 50;
          const lineHeight = 10;
          
          pdf.text(`Export Date: ${exportData.exportDate}`, 20, startY);
          pdf.text(`Export Time: ${exportData.exportTime}`, 20, startY + lineHeight);
          pdf.text(`Items Selected: ${exportData.selectedCount}`, 20, startY + (lineHeight * 2));
          
          pdf.setDrawColor(200, 200, 200);
          pdf.line(20, startY + (lineHeight * 3), 190, startY + (lineHeight * 3));
          
          blob = pdf.output('blob');
          break;
        }
        case 'docx': {
          const doc = new Document({
            sections: [{
              properties: {},
              children: [
                new Paragraph({ text: 'Bulk Export Report', heading: 'Heading1' }),
                new Paragraph({ text: `Export Date: ${exportData.exportDate}` }),
                new Paragraph({ text: `Export Time: ${exportData.exportTime}` }),
                new Paragraph({ text: `Items Selected: ${exportData.selectedCount}` }),
                new Paragraph({ text: 'Export Details:', heading: 'Heading2' }),
                new Paragraph({ text: `Format: ${format.toUpperCase()}` }),
                new Paragraph({ text: `Total Items: ${exportData.selectedCount}` })
              ]
            }]
          });
          blob = await Packer.toBlob(doc);
          break;
        }
      }

      if (blob) {
        await saveAs(blob, `bulk_export_${selectedCount}_items.${format}`);
        setShowExportModal(false);
        onBulkExport && onBulkExport(format);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (selectedCount === 0) return null;

  const handleBulkDelete = () => {
    if (showConfirmDelete) {
      onBulkDelete();
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
      setTimeout(() => setShowConfirmDelete(false), 3000);
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-1000">
      <div className="bg-background/80 dark:bg-gray-900/90 border border-border dark:border-gray-800 rounded-lg shadow-lg dark:shadow-black/20 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          {/* Selection Info */}
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={16} className="text-primary dark:text-primary" />
            <span className="text-sm font-medium text-foreground dark:text-white">
              {selectedCount} selected
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-border dark:bg-gray-700" />

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Select All/None Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={allSelected ? onDeselectAll : onSelectAll}
              iconName={allSelected ? "Square" : "CheckSquare"}
              iconPosition="left"
              iconSize={14}
              className="text-foreground dark:text-gray-200 hover:bg-accent/10 dark:hover:bg-gray-700/50"
            >
              {allSelected ? 'None' : 'All'}
            </Button>

            {/* Favorite Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkFavorite}
              iconName="Star"
              iconPosition="left"
              iconSize={14}
              className="text-foreground dark:text-gray-200 hover:text-warning dark:hover:text-yellow-400 hover:bg-warning/10 dark:hover:bg-yellow-500/10"
            >
              Favorite
            </Button>

            {/* Export */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowExportModal(true)}
              iconName="Download"
              iconPosition="left"
              iconSize={14}
              className="text-foreground dark:text-gray-200 hover:bg-accent/10 dark:hover:bg-gray-700/50"
            >
              Export
            </Button>

            {/* Export Modal */}
            {showExportModal && (
              <div className="absolute bottom-full mb-4 left-1/2 transform -translate-x-1/2 w-80">
                <div className="bg-background dark:bg-gray-900 border border-border dark:border-gray-800 rounded-lg shadow-lg dark:shadow-black/20 p-4 space-y-3 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground dark:text-white">
                      Export {selectedCount} selected {selectedCount === 1 ? 'item' : 'items'}
                    </p>
                    <button
                      onClick={() => setShowExportModal(false)}
                      className="text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white"
                    >
                      <Icon name="X" size={14} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {exportFormats.map((format) => (
                      <button
                        key={format.id}
                        onClick={() => handleExport(format.id)}
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm hover:bg-accent/10 dark:hover:bg-gray-800 transition-smooth group"
                      >
                        <Icon 
                          name={format.icon} 
                          size={14} 
                          className="text-muted-foreground group-hover:text-foreground dark:text-gray-400 dark:group-hover:text-white" 
                        />
                        <span className="text-foreground dark:text-gray-200">{format.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Arrow pointing down */}
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-8px] w-4 h-4 rotate-45 bg-background dark:bg-gray-900 border-r border-b border-border dark:border-gray-800"></div>
              </div>
            )}

            {/* Delete */}
            <Button
              variant={showConfirmDelete ? "destructive" : "ghost"}
              size="sm"
              onClick={handleBulkDelete}
              iconName={showConfirmDelete ? "AlertTriangle" : "Trash2"}
              iconPosition="left"
              iconSize={14}
              className={showConfirmDelete ? "bg-destructive dark:bg-red-500 text-white dark:text-white hover:bg-destructive/90 dark:hover:bg-red-600" : "text-foreground dark:text-gray-200 hover:text-destructive dark:hover:text-red-400 hover:bg-destructive/10 dark:hover:bg-red-500/10"}
            >
              {showConfirmDelete ? 'Confirm Delete' : 'Delete'}
            </Button>
          </div>

          {/* Close */}
          <div className="w-px h-6 bg-border dark:bg-gray-700" />
          <Button
            variant="ghost"
            size="icon"
            onClick={onDeselectAll}
            className="h-8 w-8 text-muted-foreground dark:text-gray-400 hover:text-foreground dark:hover:text-white"
          >
            <Icon name="X" size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;