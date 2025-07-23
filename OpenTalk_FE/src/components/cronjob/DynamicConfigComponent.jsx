import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getConfig, updateConfig } from '../../api/apiList';
import '../scss/_dynamicConfig.scss';

const Accordion = ({
  title,
  fields,
  configKey,
  configValues,
  handleChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
      <div className='accordion-title' onClick={toggleAccordion}>
        <h3>{title}</h3>
        <span>{isOpen ? '-' : '+'}</span>
      </div>
      <div className='accordion-content'>
        {isOpen &&
          fields.map((field, index) => (
            <div className='input-field' key={index}>
              <label>{field.label}:</label>
              <input
                type={field.type}
                name={field.name}
                value={configValues[field.name] || ''}
                onChange={e =>
                  handleChange(configKey, field.name, e.target.value)
                }
              />
            </div>
          ))}
      </div>
    </div>
  );
};

const customToastId = {
  success: 'toastIdSuccess',
  failure: 'toastIdFailure',
};

const DynamicConfigComponent = () => {
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('External');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await getConfig();
        console.log('Fetched Config:', response);
        if (Array.isArray(response) && response.length > 0) {
          const configObject = response.reduce((acc, config) => {
            try {
              acc[config.configKey] = JSON.parse(config.configValue);
            } catch (error) {
              console.error(
                `Error parsing configValue for key ${config.configKey}:`,
                error,
              );
              acc[config.configKey] = {};
            }
            return acc;
          }, {});
          setFormData(configObject);
        }
      } catch (error) {
        console.error('Error fetching config:', error);
        toast.error('Error fetching config!', {
          toastId: customToastId.failure,
        });
      }
    };

    fetchConfig();
  }, []);

  const handleChange = (configKey, fieldName, value) => {
    setFormData(prevData => ({
      ...prevData,
      [configKey]: {
        ...prevData[configKey],
        [fieldName]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const updates = Object.entries(formData).map(([key, value]) => ({
        configKey: key,
        configValue: JSON.stringify(value),
      }));

      // Call the updateConfig API with the prepared data
      await updateConfig(updates);
      toast.success('Config updated successfully!', {
        toastId: customToastId.success,
      });
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Error saving config!', {
        toastId: customToastId.failure,
      });
    }
  };

  const externalAccordions = [
    {
      key: 'application_image',
      title: 'Application URL Image',
      fields: [
        {
          name: 'application_url_image',
          label: 'Application URL Image',
          type: 'text',
        },
      ],
    },
    {
      key: 'facial_recognition_service',
      title: 'Facial Recognition',
      fields: [
        {
          name: 'facial_recognition_uri',
          label: 'Facial Recognition URI',
          type: 'text',
        },
      ],
    },
    {
      key: 'komu_service',
      title: 'Komu',
      fields: [
        { name: 'komu_url', label: 'Komu Bot URL', type: 'text' },
        { name: 'komu_secret_key', label: 'Komu Secret Key', type: 'text' },
      ],
    },
    {
      key: 'ims_service',
      title: 'Ims',
      fields: [
        { name: 'ims_secret_key', label: 'Ims Secret Key', type: 'text' },
      ],
    },
    {
      key: 'timesheet_service',
      title: 'Timesheet',
      fields: [
        {
          name: 'timesheet_secret_key',
          label: 'Timesheet Secret Key',
          type: 'text',
        },
        {
          name: 'timesheet_security_code',
          label: 'Timesheet Security Code',
          type: 'text',
        },
        {
          name: 'timesheet_api_url',
          label: 'Timesheet API URL',
          type: 'text',
        },
      ],
    },
    {
      key: 'hrm_service',
      title: 'HRM',
      fields: [
        { name: 'hrm_api_url', label: 'HRM API URL', type: 'text' },
        {
          name: 'hrm_api_secret_key',
          label: 'HRM API Secret Key',
          type: 'text',
        },
      ],
    },
    {
      key: 'mezon_service',
      title: 'Mezon',
      fields: [
        {
          name: 'mezon_send_image_check_in',
          label: 'Mezon send image check in',
          type: 'text',
        },
        {
          name: 'mezon_send_image_report_check_in_wrong_too_much',
          label: 'Mezon send image report check in wrong too much',
          type: 'text',
        },
      ],
    },
    {
      key: 'camip_service',
      title: 'Camip',
      fields: [
        {
          name: 'camip_uri',
          label: 'Camip URI',
          type: 'text',
        },
        {
          name: 'camip_secret_key',
          label: 'Camip Secret Key',
          type: 'text',
        },

      ],
    },
    {
      key: 'anti_spoof_key',
      title: 'Anti Spoof Score',
      fields: [
        {
          name: 'anti_spoof_value',
          label: 'Anti Spoof Score',
          type: 'text',
        },
      ],
    },
  ];

  const internalAccordions = [
    {
      key: 'checkin_service',
      title: 'Checkin',
      fields: [{ name: 'checkin_url', label: 'Checkin URL', type: 'text' }],
    },
  ];

  return (
    <div className='dynamic-config-container'>
      <div className='tabs'>
        <button
          className={`tab-button ${activeTab === 'External' ? 'active' : ''}`}
          onClick={() => setActiveTab('External')}
        >
          External
        </button>
        <button
          className={`tab-button ${activeTab === 'Internal' ? 'active' : ''}`}
          onClick={() => setActiveTab('Internal')}
        >
          Internal
        </button>
      </div>
      <div className='config-detail-container'>
        {(activeTab === 'External'
          ? externalAccordions
          : internalAccordions
        ).map((accordion, index) => (
          <Accordion
            key={index}
            title={accordion.title}
            fields={accordion.fields}
            configKey={accordion.key}
            configValues={formData[accordion.key] || {}}
            handleChange={handleChange}
          />
        ))}
      </div>
      <button className='save-button' onClick={handleSave}>
        Save
      </button>
    </div>
  );
};

export default DynamicConfigComponent;
