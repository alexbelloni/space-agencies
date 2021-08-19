import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Container,
  Form,
  Button,
  Input,
} from './style';

const Comp = props => {
  const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    color: "black"
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => props.onSubmit({
    name: data.name,
    acronym: data.acronym,
    url: data.url,
    country: data.country,
    id: props.selected.id
  });

  setValue('name', props.selected.name);
  setValue('acronym', props.selected.acronym);
  setValue('country', props.selected.country);
  setValue('url', props.selected.url);

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)} style={style}>
        <h2>Agency</h2>
        <Input {...register('name', { required: true })} placeholder="Name" />
        {errors.name && <p>name is required.</p>}
        <Input {...register('acronym',)} placeholder="Acronym" />
        <Input {...register('country',)} placeholder="Country" />
        <Input {...register('url',)} placeholder="URL" />
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
}

export default Comp;