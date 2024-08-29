const asyncHandler = (requestHandler) =>{
    return (req,res,next) =>{
    Promise.resolve(requestHandler(req,res,next)).catch((error) => next(error))      //If the promise fails (an error happens), it catches the error and passes it to next(error), which sends the error to Express’s error-handling middleware.

}}



// const asyncHandler =(requestHandler) => async(req,res,next) =>{
//     try {
//         await requestHandler(req,res,next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success:false,
//             message:err.message
//         })
//     }
// }
export {asyncHandler};