export const hasSpecialChars = (text: string) => {
    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
    return regex.test(text)
}