import instance from "./axios";

const getString = () => {
    return instance({
        method: 'GET',
        url: '/getString'
    })
}

export default getString