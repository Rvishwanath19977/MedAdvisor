// CombinedForm.js
import React, { useState } from 'react';
import { useAuth } from '../../AuthContext';
import { fillPreMedicalForm, createBlogPost } from '../../apiService';
import './CombinedForm.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const symptomsList = [
  'Restlessness',
  'Uncontrollable feelings of worry',
  'Increased irritability',
  'Difficulty concentrating',
  'Sleep difficulties',
  'Feeling very sad, hopeless or worried. Children and adolescents with depression may be irritable rather than sad',
  'Low Energy',
  'Having thoughts of self-harm or suicide',
  'Being easily irritated or frustrated.',
  'Eating too much or too little, which may result in weight gain or weight loss',
  'Experiencing physical issues like headache, stomachache or sexual dysfunction',
  'Having the urge to avoid things that trigger anxiety',
  'Having difficulty controlling worry',
  'Having trouble sleeping',
  'Having an increased heart rate',
  'Having a sense of impending danger, panic or doom',
  'Trouble concentrating or thinking about anything other than the present worry',
];

const countryOptions = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'American Samoa',
  'Andean Latin America',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australasia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bermuda',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Cape Verde',
  'Caribbean',
  'Central African Republic',
  'Central Asia',
  'Central Europe',
  'Central Europe, Eastern Europe, and Central Asia',
  'Central Latin America',
  'Central Sub-Saharan Africa',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Costa Rica',
  'Cote d"Ivoire',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  'Democratic Republic of Congo',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'East Asia',
  'Eastern Europe',
  'Eastern Sub-Saharan Africa',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'England',
  'Entity',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Greenland',
  'Grenada',
  'Guam',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'High SDI',
  'High-income',
  'High-income Asia Pacific',
  'High-middle SDI',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latin America and Caribbean',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Lithuania',
  'Low SDI',
  'Low-middle SDI',
  'Luxembourg',
  'Macedonia',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia (country)',
  'Middle SDI',
  'Moldova',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Africa and Middle East',
  'North America',
  'North Korea',
  'Northern Ireland',
  'Northern Mariana Islands',
  'Norway',
  'Oceania',
  'Oman',
  'Pakistan',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Puerto Rico',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Scotland',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Asia',
  'South Korea',
  'South Sudan',
  'Southeast Asia',
  'Southeast Asia, East Asia, and Oceania',
  'Southern Latin America',
  'Southern Sub-Saharan Africa',
  'Spain',
  'Sri Lanka',
  'Sub-Saharan Africa',
  'Sudan',
  'Suriname',
  'Swaziland',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tropical Latin America',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
  'United States Virgin Islands',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Venezuela',
  'Vietnam',
  'Wales',
  'Western Europe',
  'Western Sub-Saharan Africa',
  'World',
  'Yemen',
  'Zambia',
  'Zimbabwe',

];

const disordersList = [
  'Schizophrenia',
  'Bipolar disorder',
  'Eating disorders',
  'Anxiety disorders',
  'Drug use disorders',
  'Alcohol use disorders',
];

const CombinedForm = () => {
  const { user } = useAuth();

  const [symptoms, setSymptoms] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [gender, setGender] = useState('');
  const [disorders_diagnosed, setDisorders_diagnosed] = useState([]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    if (name === 'symptoms') {
      setSymptoms((prevSymptoms) => {
        if (checked) {
          return [...prevSymptoms, value];
        } else {
          return prevSymptoms.filter((symptom) => symptom !== value);
        }
      });
    } else if (name === 'age') {
      setAge(value);
    } else if (name === 'country') {
      setCountry(value);
    } else if (name === 'gender') {
      setGender(value);
    } else if (name === 'disorders_diagnosed') {
      setDisorders_diagnosed((prevDisorders) => {
        if (checked) {
          return [...prevDisorders, value];
        } else {
          return prevDisorders.filter((disorder) => disorder !== value);
        }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Symptoms:', symptoms);
      const preMedicalFormResponse = await fillPreMedicalForm({
        symptoms: symptoms.join(', '),
        patient: user.id,
        age,
        country,
        gender,
        disorders_diagnosed: disorders_diagnosed.join(', '),
      });
      if (preMedicalFormResponse) {
        const blogPostResponse = await createBlogPost({
          title,
          content,
          author: user.id,
        });
        console.log('Pre-Medical Form Response:', preMedicalFormResponse);
        console.log('Blog Post Response:', blogPostResponse);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="form-container mt-5">
        <h2 className="mb-4">Create a Post and Fill Pre-Medical Form</h2>
        <Form className="combined-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title:</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Symptoms</Form.Label>
            {symptomsList.map((symptom) => (
              <Form.Check
                key={symptom}
                type="checkbox"
                label={symptom}
                name="symptoms"
                value={symptom}
                checked={symptoms.includes(symptom)}
                onChange={handleChange}
              />
            ))}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Age:</Form.Label>
            <Form.Control
              type="number"
              name="age"
              value={age}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Country:</Form.Label>
            <Form.Control
              as="select"
              name="country"
              value={country}
              onChange={handleChange}
            >
              <option value="">Select Country</option>
              {countryOptions.map((countryOption) => (
                <option key={countryOption} value={countryOption}>
                  {countryOption}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Gender:</Form.Label>
            <Form.Control
              as="select"
              name="gender"
              value={gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              Have you ever been diagnosed with any of the following disorders?
            </Form.Label>
            {disordersList.map((disorder) => (
              <Form.Check
                key={disorder}
                type="checkbox"
                label={disorder}
                name="disorders_diagnosed"
                value={disorder}
                checked={disorders_diagnosed.includes(disorder)}
                onChange={handleChange}
              />
            ))}
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CombinedForm;