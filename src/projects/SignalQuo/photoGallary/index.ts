const galleryData = import.meta.glob("./*.jpg", {
    query: {
        "thumbnail": true
    },
    eager: true
});
export default galleryData;