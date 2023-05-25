import { useFormik } from "formik";
import * as yup from "yup";
import styled from "styled-components";
import { Button, FormControl, InputLabel, MenuItem, Select, Slider, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Body = {
  name: string;
  preparation_time: string;
  type: string;
  no_of_slices?: string | null;
  diameter?: string | null;
  spiciness_scale?: string | null;
  slices_of_bread?: string | null;
};

function App() {

  const validationSchema = yup.object({
    name: yup.string().required("Name is required"),
    preparation_time: yup.string().min(8, "Invalid time format (HH:mm:ss)").max(8,"Invalid time format (HH:mm:ss)").matches(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/, 'Invalid time format (HH:mm:ss)').required("Preparation time is required"),
    type: yup.string().required("Type is required"),
    no_of_slices: yup.number().min(1, "Number of slices must be greater than 0"),
    diameter: yup.number().min(0.01, "Diameter must be greater than 0"),
    spiciness_scale: yup.number().min(1, "Spiciness scale must be between 1 and 10").max(10, "Spiciness scale must be between 1 and 10"),
    slices_of_bread: yup.number().min(1, "Slices of bread must be greater than 1"),
  });

  const settings: ToastOptions<{}> = {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    
  };


  const formik = useFormik({
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
      const body: Body = {
        name: values.name,
        preparation_time: values.preparation_time,
        type: values.type,
      };

      if (body.type === "pizza") {
        body.no_of_slices = values.no_of_slices === "" ? null : values.no_of_slices;
        body.diameter = values.diameter === "" ? null : values.diameter;
      } else if (body.type === "soup") {
        body.spiciness_scale = values.spiciness_scale === "" ? null : values.spiciness_scale;
      } else if (body.type === "sandwich") {
        body.slices_of_bread = values.slices_of_bread === "" ? null : values.slices_of_bread;
      }


      axios.post("https://umzzcc503l.execute-api.us-west-2.amazonaws.com/dishes/", body)
      .then((res) => {
        toast.success("Dish created successfully", {toastId: "CreatedSuccessfully", ...settings});
      }
      )
      .catch((err) => {
        toast.error("Something went wrong", {toastId: "Error", ...settings})
      }
      )
    },
});


  return (
    <>
      <FromContainer>
        <FormTitle>Dish creator</FormTitle>
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
              onBlur={formik.handleBlur}
              style={{ marginBottom: "20px" }}
              inputProps={{ type: "number" }}
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
              onBlur={formik.handleBlur}
              style={{ marginBottom: "20px" }}
              inputProps={{ type: "number", step: "0.01" }}
            />
          </>
        )}
        {formik.values.type === "soup" && (
          <>
            <InputLabel id="spiciness_scale">Spiciness scale</InputLabel>
            <Slider
              id="spiciness_scale"
              name="spiciness_scale"
              value={parseInt(formik.values.spiciness_scale)}
              onChange={(event, value) => formik.setFieldValue("spiciness_scale", value)}
              min={1}
              max={10}
              step={1}
              marks
              valueLabelDisplay="auto"
              style={{ marginBottom: "20px" }}
            />
            <Typography variant="caption">
              {formik.touched.spiciness_scale && formik.errors.spiciness_scale}
            </Typography>
          </>
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
            onBlur={formik.handleBlur}
            style={{ marginBottom: "20px" }}
            inputProps={{ type: "number" }}
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
          style={{ width: "60%", height: "60px", marginBottom: "20px" }}
        >
          Submit
        </Button>

        </Form>
      </FromContainer>
      <ToastContainer />
    </>
  );
}

export default App;

const FromContainer = styled.div`
  font-family: "Roboto", sans-serif;
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