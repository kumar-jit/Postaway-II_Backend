
const generateOtp = () => {
    // Generate a random number between 100000 and 999999 (inclusive)
    return Math.floor(Math.random() * 900000) + 100000; 
}
export default generateOtp;