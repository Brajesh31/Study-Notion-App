const cloudinary = require('cloudinary').v2;

// Function to extract public IDs from multiple URLs
const getPublicIdsFromUrls = (imageUrlArray) => {
  if (!Array.isArray(imageUrlArray)) {
    console.error("Expected an array of URLs");
    return [];
  }

  return imageUrlArray.map((imageUrl) => {
    try {
      const urlParts = imageUrl.split('/');
      const uploadIndex = urlParts.indexOf('upload');

      if (uploadIndex === -1) return null; // Invalid URL

      // Extract everything after 'upload/'
      let publicId = urlParts.slice(uploadIndex + 1).join('/');

      // Remove versioning (e.g., v1678901234/)
      publicId = publicId.replace(/^v\d+\//, '');

      // Remove file extension while handling names with multiple dots
      const lastDotIndex = publicId.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        publicId = publicId.substring(0, lastDotIndex);
      }
      console.log("publicIds array",publicId)
      return publicId;
    } catch (error) {
      console.error(`Error processing URL: ${imageUrl}`, error);
      return null;
    }
  }).filter(Boolean); // Remove null values
};


// Function to delete multiple images from Cloudinary
exports.deleteImages = async (imageUrlArray) => {
  try {
    const publicIds = getPublicIdsFromUrls(imageUrlArray);

    if (publicIds.length === 0) {
      console.error('No valid image URLs found');
      return;
    }
    const isVideo = imageUrlArray.some(url => url.includes("/video/upload/"));
    const resourceType = isVideo ? "video" : "image"; // Auto-detect type
    const result = await cloudinary.api.delete_resources(publicIds, {
      resource_type: resourceType, 
      invalidate: true
    });
    const result2 = await cloudinary.api.delete_resources(publicIds, {
      resource_type: "video", 
      invalidate: true
    });

    console.log('Delete result:', result);
    console.log('Delete result:', result2);
    return result;
  } catch (error) {
    console.error('Error deleting images:', error);
  }
};