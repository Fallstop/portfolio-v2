const galleryData = import.meta.glob("./*.jpg", {
    query: {
        "thumbnail": true,
    }
});
export default galleryData;