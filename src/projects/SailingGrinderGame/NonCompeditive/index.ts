const galleryData = import.meta.glob("./*.{jpg,png}", {
    query: {
        "thumbnail": true
    },
    eager: true
});
export default galleryData;