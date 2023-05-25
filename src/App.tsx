import { useFormik } from "formik";
import * as yup from "yup";
import styled from "styled-components";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect } from "react";
import axios from "axios";
import { ToastOptions, toast } from "react-toastify";


function App() {
  // const [value, setValue] = useState<Dayjs | null>(null);

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    preparation_time: yup.string().min(8, "Invalid time format (HH:mm:ss)").max(8,"Invalid time format (HH:mm:ss)").matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Invalid time format (HH:mm:ss)').required("Preparation time is required"),
    type: yup.string().required("Type is required"),
    no_of_slices: yup.number(),
    diameter: yup.number(),
    spiciness_scale: yup.number().min(1, "Spiciness scale must be between 1 and 10").max(10, "Spiciness scale must be between 1 and 10"),
    slices_of_bread: yup.number(),
  });

  const settings: ToastOptions<{}> = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    theme: "light",
  };


  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      name: "",
      preparation_time: "",
      type: "",
      no_of_slices: "",
      diameter: "",
      spiciness_scale: "",
      slices_of_bread: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const body = {
        name: values.name,
        preparation_time: values.preparation_time,
        type: values.type,
        no_of_slices: values.no_of_slices === "" ? null : values.no_of_slices,
        diameter: values.diameter === "" ? null : values.diameter,
        spiciness_scale: values.spiciness_scale === "" ? null : values.spiciness_scale,
        slices_of_bread: values.slices_of_bread === "" ? null : values.slices_of_bread,
      };

      

      axios.post("https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/", body)
      .then((res) => {
        console.log(res);
        toast.success("Dish created successfully", {toastId: "CreatedSuccessfully", ...settings});
      }
      )
      .catch((err) => {
        toast.error("Something went wrong", {toastId: "Created", ...settings})
      }
      )
    },
});

useEffect(() => {
  console.log(formik);
}, [formik]);

  return (
    <>
      <FromContainer>
        <FormTitle>Dish creater</FormTitle>
        <Form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Name"
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          onBlur={formik.handleBlur}
          style={{ marginBottom: "20px" }}
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TextField
          fullWidth
          id="preparation_time"
          name="preparation_time"
          label="Preparation time"
          value={formik.values.preparation_time}
          onChange={formik.handleChange}
          error={formik.touched.preparation_time && Boolean(formik.errors.preparation_time)}
          helperText={formik.touched.preparation_time && formik.errors.preparation_time}
          onBlur={formik.handleBlur}
          style={{ marginBottom: "20px" }}
        />
        </LocalizationProvider>
        <FormControl fullWidth>
        <InputLabel id="type">Type</InputLabel>
        <Select
          labelId="type"
          id="type"
          name="type"
          label="Type"
          value={formik.values.type}
          onChange={formik.handleChange}
          error={formik.touched.type && Boolean(formik.errors.type)}
          style={{ marginBottom: "20px" }}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="pizza">Pizza</MenuItem>
          <MenuItem value="soup">Soup</MenuItem>
          <MenuItem value="sandwich">Sandwich</MenuItem>
        </Select>
        </FormControl>
        {formik.values.type === "pizza" && (
          <>
            <TextField
              fullWidth
              id="no_of_slices"
              name="no_of_slices"
              label="Number of slices"
              value={formik.values.no_of_slices}
              onChange={formik.handleChange}
              error={formik.touched.no_of_slices && Boolean(formik.errors.no_of_slices)}
              helperText={formik.touched.no_of_slices && formik.errors.no_of_slices}
              style={{ marginBottom: "20px" }}
            />
            <TextField
              fullWidth
              id="diameter"
              name="diameter"
              label="Diameter"
              value={formik.values.diameter}
              onChange={formik.handleChange}
              error={formik.touched.diameter && Boolean(formik.errors.diameter)}
              helperText={formik.touched.diameter && formik.errors.diameter}
              style={{ marginBottom: "20px" }}
            />
          </>
        )}
        {formik.values.type === "soup" && (
          <TextField
            fullWidth
            id="spiciness_scale"
            name="spiciness_scale"
            label="Spiciness scale"
            value={formik.values.spiciness_scale}
            onChange={formik.handleChange}
            error={formik.touched.spiciness_scale && Boolean(formik.errors.spiciness_scale)}
            helperText={formik.touched.spiciness_scale && formik.errors.spiciness_scale}
            style={{ marginBottom: "20px" }}
          />
        )}
        {formik.values.type === "sandwich" && (
          <TextField
            fullWidth
            id="slices_of_bread"
            name="slices_of_bread"
            label="Slices of bread"
            value={formik.values.slices_of_bread}
            onChange={formik.handleChange}
            error={formik.touched.slices_of_bread && Boolean(formik.errors.slices_of_bread)}
            helperText={formik.touched.slices_of_bread && formik.errors.slices_of_bread}
            style={{ marginBottom: "20px" }}
          />
        )}

        <Button 
          variant="contained" 
          color="primary" 
          type="submit" 
          disabled={
            !formik.isValid ||
            !formik.dirty ||
            (formik.values.type === 'pizza' && (!formik.values.no_of_slices || !formik.values.diameter)) ||
            (formik.values.type === 'soup' && !formik.values.spiciness_scale) ||
            (formik.values.type === 'sandwich' && !formik.values.slices_of_bread)
          }
        >
          Submit
        </Button>

        </Form>
      </FromContainer>
    </>
  );
}

export default App;

const FromContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const FormTitle = styled.h1`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 30px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 500px;
  padding: 30px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;