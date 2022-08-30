type comment = {
    _id: string,
    comment: string,
    date_time: Date,
    user_id: string | user
}

type user = {
    _id: string,
    first_name: string,
    last_name: string,
    location: string,
    description: string,
    occupation: string,
    login_name: string
}

type photo = {
    _id: string,
    file_name: string,
    date_time: Date,
    user_id: string | user,
    comments: comment[],
    mentions: string[],
    likes: string[]
}

type activity = {
    _id: string,
    type: "register" | "logout" | "login" | "add comment" | "photo upload",
    date_time: Date,
    user: user,
    photo: photo
}

type mention = {
    childIndex: number,
    display: string,
    id: string,
    index: number,
    plainTextIndex: number
}

export type {comment, user, photo, activity, mention}