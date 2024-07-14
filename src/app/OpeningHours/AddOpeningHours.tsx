"use client";
import TimeSlot, { DeliveryType, FetchedTimeSlot, TimeSlotProps } from "@/_objects/TimeSlot";
import { Grid, Group, Input, Paper, Radio, Textarea, Title, UnstyledButton } from "@mantine/core";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "Yup";
import './AddOpeningHours.scss';
import { IconArrowLeft } from "@tabler/icons-react";
import InputWrapper from "@/_components/Form/InputWrapper";
import OpeningHoursCycleChoice from "@/_components/OpeningHours/OpeningHoursCycleChoice";

interface AddOpeningHoursProps {
  data?: FetchedTimeSlot;
  onRequestClose: () => void;
}

const AddOpeningHours = ({ data, onRequestClose }: AddOpeningHoursProps) => {

  const [formData, setFormData] = useState<FetchedTimeSlot>(new TimeSlot() as FetchedTimeSlot)

  useEffect(() => {
    if (formData.update) {
      setFormData(data!)
    };
  }, [])

  return (
    <div id="AddOpeningHours">
      <Formik
        initialValues={formData}
        enableReinitialize={true}
        validationSchema={Yup.object().shape({
          name: Yup.string()
            .required("Veuillez renseigner le nom."),
          description: Yup.string()
            .max(1000, "La limite de 1000 caractères est atteinte."),
        })
        }
        onSubmit={(values) => {

        }}
      >
        {({ values,
          errors,
          touched,
          setFieldValue,
          handleBlur,
          isSubmitting
        }) => (
          <Form>
            <Group mb={30}>
              <UnstyledButton
                onClick={onRequestClose}
                className="back_button"
              >
                <IconArrowLeft />
              </UnstyledButton>
              <Title>Ajouter un cycle</Title>
            </Group>
            <Grid>
              <Grid.Col span={6}>
                <Paper shadow="md" radius={'sm'} p={"md"} mb={20} withBorder>
                  <InputWrapper
                    name="name"
                    label="Nom"
                    onBlur={handleBlur}
                    error={touched.name && errors.name}
                    placeholder="Saissiez un nom"
                    withAsterisk={true}
                    value={values.name}
                    onChange={(e) => setFieldValue("name", e.target.value)}
                  />
                  <Textarea
                    name="description"
                    label="Description"
                    description=""
                    placeholder=""
                    error={touched.description && errors.description}
                    value={values.description}
                    onChange={(e) => setFieldValue("description", e.target.value)}
                    onBlur={handleBlur}
                  />
                </Paper>
              </Grid.Col>

              <Grid.Col span={6}>
                <Paper shadow="md" radius={'sm'} p={"md"} withBorder>
                  <Title order={3} mb={10}>Type</Title>
                  <Radio.Group
                    label=""
                    value={values.type}
                  >
                    <Group align="center" justify="center">
                      <Radio
                        label="Livraison"
                        value={DeliveryType.DELIVERY_ROUTE}
                        onChange={(e) => setFieldValue("type", e.target.value)}
                      />
                      <Radio
                        value={DeliveryType.PICK_UP_POINT}
                        label="Retrait"
                        onChange={(e) => setFieldValue("type", e.target.value)}
                      />
                    </Group>
                  </Radio.Group>
                </Paper>
              </Grid.Col>

              <Grid.Col span={12}>
                <Paper shadow="md" radius={'sm'} p={"md"} withBorder>
                  <Title order={3} mb={10}>Plage horaire</Title>
                  <OpeningHoursCycleChoice
                    isSubmitting={isSubmitting}
                    openingHours={values.openingHours}
                    timeSlot={formData}
                    onOpeningHoursUpdated={(newOSM: string) => {
                      setFieldValue('openingHours', newOSM);
                    }}
                    onDateUpdated={(fieldName: string, newDate: any) => {
                      setFieldValue(fieldName, newDate)
                    }}
                    onOAUpdated={(fieldName: string, value: any) => {
                      setFieldValue(fieldName, value)
                    }}
                  />
                </Paper>
              </Grid.Col>
            </Grid>


          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AddOpeningHours;