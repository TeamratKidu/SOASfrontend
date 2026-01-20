import api from './api';

export interface UploadResponse {
    filename: string;
    path: string;
    size: number;
    mimetype: string;
}

export const uploadService = {
    async uploadFile(file: File): Promise<UploadResponse> {
        const formData = new FormData();
        formData.append('image', file); // Backend expects 'image' field name still

        const response = await api.post('/uploads/file', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
