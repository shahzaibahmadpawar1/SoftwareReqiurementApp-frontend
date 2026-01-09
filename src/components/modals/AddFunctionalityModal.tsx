import { useState } from 'react';
import { functionalitiesApi } from '../../services/api';
import { Functionality, FieldDefinition } from '../../types';

interface AddFunctionalityModalProps {
    pageId: number;
    onClose: () => void;
    onFunctionalityCreated: (functionality: Functionality) => void;
}

const AddFunctionalityModal = ({ pageId, onClose, onFunctionalityCreated }: AddFunctionalityModalProps) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<'button' | 'form' | 'table'>('button');
    const [dataToDisplay, setDataToDisplay] = useState('');
    const [fields, setFields] = useState<FieldDefinition[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const addField = () => {
        setFields([...fields, { name: '', type: 'text', required: false }]);
    };

    const updateField = (index: number, updates: Partial<FieldDefinition>) => {
        const newFields = [...fields];
        newFields[index] = { ...newFields[index], ...updates };
        setFields(newFields);
    };

    const removeField = (index: number) => {
        setFields(fields.filter((_, i) => i !== index));
    };

    const handleNext = () => {
        if (!name.trim()) {
            setError('Functionality name is required');
            return;
        }
        if (!type) {
            setError('Please select a type');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError('');

        try {
            const response = await functionalitiesApi.create({
                pageId,
                name: name.trim(),
                description: description.trim() || undefined,
                type,
                fields: (type === 'form' || type === 'table') && fields.length > 0 ? fields : undefined,
                dataToDisplay: dataToDisplay.trim() || undefined,
            });
            onFunctionalityCreated(response.data);
        } catch (err) {
            setError('Failed to create functionality. Please try again.');
            console.error('Error creating functionality:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">
                        Add Functionality {step === 2 && `- Step 2`}
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        ×
                    </button>
                </div>

                {step === 1 ? (
                    <div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="func-name">
                                Functionality Name *
                            </label>
                            <input
                                id="func-name"
                                type="text"
                                className="form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Submit Button, Login Form, User Table"
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="func-description">
                                Description
                            </label>
                            <textarea
                                id="func-description"
                                className="form-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe what this functionality does"
                                rows={3}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Type *</label>
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: type === 'button' ? 'var(--primary-600)' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', flex: 1, minWidth: '150px' }}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="button"
                                        checked={type === 'button'}
                                        onChange={(e) => setType(e.target.value as any)}
                                    />
                                    <span>Button</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: type === 'form' ? 'var(--primary-600)' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', flex: 1, minWidth: '150px' }}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="form"
                                        checked={type === 'form'}
                                        onChange={(e) => setType(e.target.value as any)}
                                    />
                                    <span>Form</span>
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem', background: type === 'table' ? 'var(--primary-600)' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', cursor: 'pointer', flex: 1, minWidth: '150px' }}>
                                    <input
                                        type="radio"
                                        name="type"
                                        value="table"
                                        checked={type === 'table'}
                                        onChange={(e) => setType(e.target.value as any)}
                                    />
                                    <span>Table</span>
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="form-error">{error}</div>
                        )}

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleNext}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        {type === 'button' ? (
                            <div className="empty-state" style={{ padding: '2rem' }}>
                                <p className="text-secondary">
                                    Button functionality doesn't require additional configuration.
                                    Click "Create" to finish.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="data-display">
                                        Data to Display
                                    </label>
                                    <textarea
                                        id="data-display"
                                        className="form-textarea"
                                        value={dataToDisplay}
                                        onChange={(e) => setDataToDisplay(e.target.value)}
                                        placeholder="Describe what data this form/table needs to display"
                                        rows={2}
                                    />
                                </div>

                                <div className="form-group">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <label className="form-label" style={{ marginBottom: 0 }}>
                                            Fields
                                        </label>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-secondary"
                                            onClick={addField}
                                        >
                                            + Add Field
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                                        {fields.map((field, index) => (
                                            <div key={index} style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    value={field.name}
                                                    onChange={(e) => updateField(index, { name: e.target.value })}
                                                    placeholder="Field name"
                                                    style={{ flex: 2 }}
                                                />
                                                <select
                                                    className="form-select"
                                                    value={field.type}
                                                    onChange={(e) => updateField(index, { type: e.target.value })}
                                                    style={{ flex: 1 }}
                                                >
                                                    <option value="text">Text</option>
                                                    <option value="number">Number</option>
                                                    <option value="email">Email</option>
                                                    <option value="date">Date</option>
                                                    <option value="boolean">Boolean</option>
                                                    <option value="select">Select</option>
                                                </select>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', whiteSpace: 'nowrap' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={field.required}
                                                        onChange={(e) => updateField(index, { required: e.target.checked })}
                                                    />
                                                    <span style={{ fontSize: '0.75rem' }}>Required</span>
                                                </label>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => removeField(index)}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {error && (
                            <div className="form-error">{error}</div>
                        )}

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setStep(1)}
                                disabled={loading}
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create Functionality'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AddFunctionalityModal;
