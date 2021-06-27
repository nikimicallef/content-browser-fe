import { Content } from 'src/app/models/content';

export const randomImageContent = (): Content => {
    return {
        id: "123",
        mediaType: "IMAGE",
        source: "src",
        title: "title",
        contentUrl: "https://img.liiift.io/v1/RBCP/FO-1EK1ZFMA92111.jpg/a:h/im/image_proxy_large.jpg?ht=exp=1644451200+hmac=358d34e2d5247329260884505de8c596",
        previewUrl: "https://img.liiift.io/v1/RBCP/FO-1EK1ZFPQ92111.jpg/a:h/im/image_proxy_thumb.jpg?ht=exp=1644451200+hmac=8c0e076e69d7d27022acad60a4cc2295",
        votes: 0,
        description: null,
        length: null,
        aspectRatio: null,
        topic: null
    };
};

export const randomVideoContent = (): Content => {
    return {
        id: "456",
        mediaType: "VIDEO",
        source: "src",
        title: "title",
        contentUrl: "https://cs.liiift.io/v1/RBCP/pd/1/E7/NB/9Q/Y1/25/11/FO-1E7NB9QY12511.mp4/a:h/proxy_hd_720.mp4?ht=exp=1644451200+hmac=5b982331b096c70793fb69c40e3aaf54",
        previewUrl: "https://img.liiift.io/v1/RBCP/FO-1YQ7W7DT15N11.jpg/a:h/im/reference_keyframe.jpg?ht=exp=1644451200+hmac=fdd1f92f8356122af2fb3ab56e2abfdb",
        votes: 0,
        description: "Desc",
        length: 10,
        aspectRatio: "16:9",
        topic: "topic"
    };
};

export const emptyContent = (): Content => {
    return {
        id: "",
        mediaType: "IMAGE",
        source: "",
        title: "",
        contentUrl: "",
        previewUrl: "",
        votes: 0,
        description: null,
        length: null,
        aspectRatio: null,
        topic: null
    };
};

export const randomContentList = (): Content[] => {
    return [randomImageContent(), randomVideoContent()];
}