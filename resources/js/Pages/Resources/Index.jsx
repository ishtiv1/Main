import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Inertia } from '@inertiajs/inertia';
import { usePage, Head } from '@inertiajs/react';
import './Index.css';

export default function Index() {
    const { resources } = usePage().props;
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [isModalVisible, setModalVisible] = useState(false);
    const [isEditMode, setEditMode] = useState(false);
    const [currentResourceId, setCurrentResourceId] = useState(null);
    const [selectedResource, setSelectedResource] = useState(null); // New state for full description modal
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Current page state
    const itemsPerPage = 5; // Number of items per page

    const handleCreate = (e) => {
        e.preventDefault();
        Inertia.post(route('resources.store'), formData);
        resetForm();
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        Inertia.put(route('resources.update', currentResourceId), formData);
        resetForm();
    };

    const resetForm = () => {
        setFormData({ name: '', description: '' });
        setModalVisible(false);
        setEditMode(false);
        setCurrentResourceId(null);
    };

    const handleEdit = (resource) => {
        setFormData({ name: resource.name, type: resource.type, description: resource.description });
        setCurrentResourceId(resource.id);
        setEditMode(true);
        setModalVisible(true);
    };

    const handleDelete = (id) => {
        Inertia.delete(route('resources.destroy', id));
    };

    const handleRowClick = (resource) => {
        setSelectedResource(resource); // Set selected resource for modal
    };

    const closeFullDescriptionModal = () => {
        setSelectedResource(null); // Clear selected resource
    };

    const filteredResources = resources
        .filter(resource =>
            resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
    const displayedResources = filteredResources.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setModalVisible(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="GPU" />

            <div className="container">
                <h1>GPU</h1>

                <div className="header-actions">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button className="add" onClick={() => setModalVisible(true)}>
                        Add New Data
                    </button>
                </div>

                {isModalVisible && (
                    <div className="modal-overlay" onClick={handleOverlayClick}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>{isEditMode ? 'Edit Resource' : 'Add New GPU'}</h2>
                            <form onSubmit={isEditMode ? handleUpdate : handleCreate}>
                                <input
                                    type="text"
                                    placeholder="Name*"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Type*"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    required
                                />
                                <textarea
                                    placeholder="Manufacturer*"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                                <div className="modal-buttons">
                                    <button type="submit">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {selectedResource && (
                    <div className="modal-overlay" onClick={closeFullDescriptionModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <h2>GPU Details</h2>
                            <p><strong>GPU Name:</strong> {selectedResource.name}</p>
                            <p><strong>Type:</strong> {selectedResource.type}</p>
                            <p><strong>Manufacturer:</strong> {selectedResource.description}</p>
                            <p><strong>Date Created:</strong> {formatDate(selectedResource.created_at)}</p>
                            <button onClick={closeFullDescriptionModal}>Close</button>
                        </div>
                    </div>
                )}

                <table>
                    <thead>
                        <tr>
                            <th>GPU Brand</th>
                            <th>Type</th>
                            <th>Manufacturer</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedResources.map(resource => (
                            <tr key={resource.id} onClick={() => handleRowClick(resource)}>
                                <td>{resource.name}</td>
                                <td>{resource.type}</td>
                                <td>{resource.description}</td>
                                <td>{formatDate(resource.created_at)}</td>
                                <td>{formatDate(resource.updated_at)}</td>
                                <td>
                                    <div className="button-container">
                                        <button
                                            className="edit"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent row click handler
                                                handleEdit(resource);
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete"
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent row click handler
                                                handleDelete(resource.id);
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pagination">
                    <button onClick={prevPage} disabled={currentPage === 1}>
                        &larr; Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button onClick={nextPage} disabled={currentPage === totalPages}>
                        Next &rarr;
                    </button>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
