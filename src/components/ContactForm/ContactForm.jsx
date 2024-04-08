import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import iziToast from 'izitoast';

import normalizeName from '../../helpers/nameNormalize';
import { contactSchema } from '../../helpers/contactSchema';
import { selectContacts } from '../../redux/selectors';
import { addContact } from '../../redux/contactsSlice';

import 'izitoast/dist/css/iziToast.min.css';
import styles from './ContactForm.module.css';

const initialValues = {
  name: '',
  number: '',
};

function ContactForm() {
  const dispatch = useDispatch();
  const contacts = useSelector(selectContacts);

  const nameFieldId = useId();
  const numberFieldId = useId();

  const submitHandler = ({ name, number }, { resetForm }) => {
    const correctName = normalizeName(name);

    if (contacts.some((contact) => contact.name === correctName)) {
      iziToast.error({
        title: 'Error',
        message: `${correctName} is already in contact!`,
        position: 'topRight',
      });
      return;
    }

    dispatch(addContact(correctName, number));
    resetForm();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitHandler}
      validationSchema={contactSchema}
    >
      <Form className={styles.form}>
        <div className={styles.inputContainer}>
          <label htmlFor={nameFieldId}>Name</label>
          <Field type="text" name="name" id={nameFieldId} />
          <ErrorMessage
            className={styles.errorMessage}
            name="name"
            component="span"
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor={numberFieldId}>Number</label>
          <Field type="tel" name="number" id={numberFieldId} />
          <ErrorMessage
            className={styles.errorMessage}
            name="number"
            component="span"
          />
        </div>

        <button type="submit">Add contact</button>
      </Form>
    </Formik>
  );
}

export default ContactForm;
