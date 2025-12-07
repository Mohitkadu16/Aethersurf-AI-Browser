import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ImagesContent = ({ images = [], isLoading = false }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square bg-muted rounded-lg mb-2"></div>
            <div className="h-3 bg-muted rounded w-3/4 mb-1"></div>
            <div className="h-2 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="Image" size={48} className="text-text-secondary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">No images found</h3>
        <p className="text-text-secondary">Try adjusting your search query to find relevant visual references.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="group cursor-pointer transition-smooth hover:transform hover:scale-105"
            onClick={() => setSelectedImage(image)}
          >
            <div className="aspect-square overflow-hidden rounded-lg border border-light bg-surface">
              <Image
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover group-hover:opacity-90 transition-smooth"
              />
            </div>
            <div className="mt-2">
              <h4 className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-smooth">
                {image.title}
              </h4>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-text-secondary truncate">
                  {image.source}
                </span>
                <div className="flex items-center space-x-1">
                  <Icon name="ExternalLink" size={12} className="text-text-secondary" />
                  <span className="text-xs text-text-secondary">
                    {image.dimensions}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-1100 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full bg-background rounded-lg overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setSelectedImage(null)}
                className="w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-smooth"
              >
                <Icon name="X" size={16} color="white" />
              </button>
            </div>
            <div className="max-h-[80vh] overflow-auto">
              <Image
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto"
              />
            </div>
            <div className="p-4 border-t border-light">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {selectedImage.title}
              </h3>
              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span>Source: {selectedImage.source}</span>
                <span>{selectedImage.dimensions}</span>
              </div>
              {selectedImage.description && (
                <p className="text-sm text-text-secondary mt-2">
                  {selectedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagesContent;