type User = {
    _id: string,
    first_name: string,
    last_name: string,
    location: string,
    description: string,
    occupation: string,
    login_name: string
}

type Mention = {
    childIndex: number,
    display: string,
    id: string,
    index: number,
    plainTextIndex: number
}

type Comment = {
    _id: string,
    comment: string,
    date_time: Date,
    user_id?: string,
    user?: User,
    mentions: Mention[],
    comment_markup: string
}

type Photo = {
    _id: string,
    file_name: string,
    date_time: Date,
    user_id: User,
    comments: Comment[],
    mentions: string[],
    likes: string[]
}

type Activity = {
    _id: string,
    type: "register" | "logout" | "login" | "add comment" | "photo upload",
    date_time: Date,
    user: User,
    photo: Photo
}

export type {Comment, User, Photo, Activity, Mention};