import Resizer from "react-image-file-resizer";
import { useSelector, shallowEqual } from "react-redux";
import { Avatar, Badge } from "antd";


export function FileUpload({ values, setValues, setLoading }) {
  const { user } = useSelector((state) => ({ ...state }), shallowEqual);

  const resizeFile = (file) =>
    new Promise((resolve, reject) => {
      Resizer.imageFileResizer(
        file,
        300, // maxWidth
        300, // maxHeight
        "JPEG", // compressedType
        100, // quality
        0, // rotation
        (uri) => {
          resolve(uri);
        }, // callback
        (err) => {
          reject(err);
        } // errorCallback
      );
    });

  const fileUploadAndResize = async (e) => {
    const files = e.target.files;
    const allUploadFiles = values.images;
    if (files) {
      const resizedFiles = [];
      for (let i = 0; i < files.length; i++) {
        resizeFile(files[i])
          .then((resizedUri) => {
            resizedFiles.push(`data:image/jpeg;base64,${resizedUri}`);
            setLoading(true);
            fetch(`${import.meta.env.VITE_APP_API}/uploadimages`, {
              method: "POST",
              body: JSON.stringify({ image: resizedUri }),
              headers: {
                "Content-Type": "application/json",
                authtoken: user ? user.token : "",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                console.log("IMAGE UPLOAD RES DATA", data);
                allUploadFiles.push(data);
                setLoading(false);
                setValues({ ...values, images: allUploadFiles });
              })
              .catch((err) => {
                console.error("Error uploading image:", err);
                setLoading(false);
              });
          })
          .catch((err) => {
            console.error("Error resizing file:", err);
            setLoading(false);
          });
      }
      console.log(resizedFiles);
    }
  };

  const handleImageRemove = (public_id) => {
    console.log(public_id);
    setLoading(true);
    fetch(`${import.meta.env.VITE_APP_API}/removeimage/${public_id}`, {
      method: "DELETE",
      headers: {
        authtoken: user ? user.token : "",
      },
    })
      .then((res) => {
        setLoading(false);
        const { images } = values;
        let filteredImages = images.filter((item) => {
          return item.public_id !== public_id;
        });
        setValues({ ...values, images: filteredImages });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="row">
        {values.images &&
          values.images.map((image) => (
            <Badge
              count="X"
              key={image.public_id}
              onClick={() => handleImageRemove(image.public_id)}
              style={{ cursor: "pointer" }}
            >
              <Avatar
                src={image.url}
                size={100}
                shape="square"
                className="ml-3"
              />
            </Badge>
          ))}
      </div>
      <div className="row">
        <label
          className="btn-primary btn-raised mt-3"
          style={{
            height: "5vh",
            width: "15vw",
            color: "blue",
            cursor: "pointer",
          }}
        >
          <h4>Choose File</h4>
          <hr />
          <input
            type="file"
            multiple
            hidden
            accept="images/*"
            onChange={fileUploadAndResize}
          />
        </label>
      </div>
    </>
  );
}
