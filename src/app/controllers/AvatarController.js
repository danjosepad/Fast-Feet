import Avatar from '../models/Avatar';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const avatar = await Avatar.create({
      name,
      path,
    });

    return res.json(avatar);
  }
}

export default new FileController();
