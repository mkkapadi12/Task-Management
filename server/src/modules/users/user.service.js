import cloudinary from "../../config/cloudinary";
import uploadToCloudinary from "../../utils/uploadToCloudinary";

const UserService = {
  update: async ({ id, body, file }) => {
    const existuser = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!existuser) throw new AppError("User not found.", 404);

    const { name } = body;

    let avatar = existuser.avatar;
    let publicId = existuser.publicId;

    if (file) {
      if (existuser.publicId) {
        await cloudinary.v2.uploader.destroy(existuser.publicId);
      }
      const uploaded = await uploadToCloudinary(file.buffer);
      avatar = uploaded.secure_url;
      publicId = uploaded.public_id;
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(avatar && { avatar }),
        ...(publicId && { publicId }),
      },
    });
    return user;
  },
};

export default UserService;
