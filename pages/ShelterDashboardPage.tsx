import React, { useState } from 'react';
import { Shelter, Need, ItemType, Urgency, Status } from '../types';
import { ChartBarIcon, ClockIcon, CheckCircleIcon, PencilIcon, CheckIcon, XIcon, PlusIcon, MinusIcon } from '../components/icons';

interface ShelterDashboardPageProps {
  shelter: Shelter;
  needs: Need[];
  addNeed: (newNeed: Omit<Need, 'id' | 'shelterId' | 'status' | 'originalQuantity'>) => void;
  updateNeed: (updatedNeed: Need) => void;
  deleteNeed: (needId: string) => void;
}

const StatCard: React.FC<{ title: string, value: number, icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

const ShelterDashboardPage: React.FC<ShelterDashboardPageProps> = ({ shelter, needs, addNeed, updateNeed, deleteNeed }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingNeedId, setEditingNeedId] = useState<string | null>(null);
  const [editedQuantity, setEditedQuantity] = useState(0);
  const [formData, setFormData] = useState({
    itemType: ItemType.Food,
    name: '',
    quantity: 10,
    urgency: Urgency.Medium,
    description: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addNeed(formData);
    setFormData({ itemType: ItemType.Food, name: '', quantity: 10, urgency: Urgency.Medium, description: '' });
    setShowForm(false);
  };

  const handleStartEdit = (need: Need) => {
    setEditingNeedId(need.id);
    setEditedQuantity(need.originalQuantity);
  };

  const handleSaveEdit = () => {
    if (editingNeedId === null) return;
    const needToUpdate = needs.find(n => n.id === editingNeedId);
    if (needToUpdate) {
        const pledgedAmount = needToUpdate.originalQuantity - needToUpdate.quantity;
        const newRemainingQuantity = editedQuantity - pledgedAmount;
        if (newRemainingQuantity < 0) {
            alert("The new total quantity cannot be less than the amount already pledged by donors.");
            return;
        }
        updateNeed({ ...needToUpdate, originalQuantity: editedQuantity, quantity: newRemainingQuantity });
    }
    setEditingNeedId(null);
  };
  
  const handleStatusChange = (need: Need, newStatus: Status) => {
    if (need.status === Status.Pending && newStatus === Status.Active) {
      // If a pending donation falls through, reset the remaining quantity to the original total
      updateNeed({ ...need, status: newStatus, quantity: need.originalQuantity });
    } else {
      updateNeed({ ...need, status: newStatus });
    }
  };

  const NeedRow: React.FC<{need: Need}> = ({ need }) => {
    const isEditing = editingNeedId === need.id;

    const StatusButton: React.FC<{status: Status}> = ({ status }) => {
        const base = "px-2 py-0.5 text-xs font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
        const styles = {
            [Status.Active]: "bg-blue-100 text-blue-800 hover:bg-blue-200",
            [Status.Pending]: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
            [Status.Fulfilled]: "bg-green-100 text-green-800 hover:bg-green-200"
        }
        return <button className={`${base} ${styles[status]}`} onClick={() => handleStatusChange(need, status)} disabled={need.status === status}>{status}</button>
    }
    
    const QuantityDisplay = () => {
        switch(need.status) {
            case Status.Active:
                return <><span className="font-semibold">{need.quantity}</span> units needed</>;
            case Status.Pending:
                const pledged = need.originalQuantity - need.quantity;
                return <><span className="font-semibold">{pledged}/{need.originalQuantity}</span> units pledged</>;
            case Status.Fulfilled:
                return <><span className="font-semibold">{need.originalQuantity}</span> units received</>;
            default:
                return null;
        }
    }

    return (
      <div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-100 transition-all ${isEditing ? 'ring-2 ring-brand-blue shadow-lg' : 'hover:shadow-md'}`}>
          <div className="flex justify-between items-start">
              <div>
                  <p className="font-bold text-gray-800">{need.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setEditedQuantity(q => Math.max(1, q - 1))} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><MinusIcon className="h-4 w-4"/></button>
                            <input
                                type="number"
                                value={editedQuantity}
                                onChange={(e) => setEditedQuantity(Number(e.target.value))}
                                className="w-16 text-center border-gray-300 rounded-md shadow-sm text-sm focus:ring-brand-blue focus:border-brand-blue"
                                min="1"
                                autoFocus
                            />
                            <button onClick={() => setEditedQuantity(q => q + 1)} className="p-1 rounded-full bg-gray-200 hover:bg-gray-300"><PlusIcon className="h-4 w-4"/></button>
                            <button onClick={handleSaveEdit} className="p-1 text-green-600 hover:bg-green-100 rounded-full"><CheckIcon className="h-4 w-4" /></button>
                            <button onClick={() => setEditingNeedId(null)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"><XIcon className="h-4 w-4" /></button>
                        </div>
                    ) : (
                        <>
                            <p className="text-sm text-gray-600"><QuantityDisplay/></p>
                            <button onClick={() => handleStartEdit(need)} className="p-1 text-gray-500 hover:bg-gray-100 rounded-full"><PencilIcon className="h-4 w-4" /></button>
                        </>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{need.description}</p>
              </div>
              <div className="flex-shrink-0 ml-4 text-right">
                <div className="flex items-center gap-1">
                    {(Object.values(Urgency) as Urgency[]).map(urg => (
                        <button key={urg} onClick={() => updateNeed({ ...need, urgency: urg})}
                            className={`px-1.5 py-0.5 text-xs rounded-full border
                                ${need.urgency === urg 
                                    ? 'font-bold ' + { [Urgency.High]: 'bg-red-500 text-white border-red-500', [Urgency.Medium]: 'bg-yellow-500 text-white border-yellow-500', [Urgency.Low]: 'bg-green-500 text-white border-green-500' }[urg]
                                    : 'text-gray-500 bg-white hover:bg-gray-100'
                                }`}
                        >{urg.charAt(0)}</button>
                    ))}
                </div>
                <button onClick={() => deleteNeed(need.id)} className="mt-2 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors">Delete</button>
              </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Status:</span>
            <div className="flex gap-2">
                <StatusButton status={Status.Active} />
                <StatusButton status={Status.Pending} />
                <StatusButton status={Status.Fulfilled} />
            </div>
          </div>
      </div>
    );
  };
  
  const activeNeeds = needs.filter(n => n.status === Status.Active);
  const pendingNeeds = needs.filter(n => n.status === Status.Pending);
  const fulfilledNeeds = needs.filter(n => n.status === Status.Fulfilled);

  return (
    <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900">Welcome, {shelter.name}</h1>
                <p className="text-lg text-gray-600 mt-1">Here's your dashboard overview.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <StatCard title="Active Needs" value={activeNeeds.length} icon={<ChartBarIcon className="h-6 w-6 text-brand-blue" />} />
                <StatCard title="Pending Donations" value={pendingNeeds.length} icon={<ClockIcon className="h-6 w-6 text-brand-blue" />} />
                <StatCard title="Fulfilled Needs" value={fulfilledNeeds.length} icon={<CheckCircleIcon className="h-6 w-6 text-brand-blue" />} />
            </div>

            <div className="mb-8">
                <button onClick={() => setShowForm(!showForm)} className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105 shadow-sm hover:shadow-lg">
                {showForm ? 'Cancel' : '+ Post a New Need'}
                </button>
                {showForm && (
                <div className="mt-6 bg-white p-6 rounded-lg shadow-md border border-gray-200">
                    <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800">New Need Details</h3>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue" placeholder="e.g., Winter Coats" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="itemType" className="block text-sm font-medium text-gray-700">Category</label>
                            <select name="itemType" id="itemType" value={formData.itemType} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue">
                                {Object.values(ItemType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
                            <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleInputChange} required min="1" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue" />
                        </div>
                        <div>
                            <label htmlFor="urgency" className="block text-sm font-medium text-gray-700">Urgency</label>
                            <select name="urgency" id="urgency" value={formData.urgency} onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue">
                                {Object.values(Urgency).map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} required rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue" placeholder="Add any details like sizes, brands, or specific requirements."></textarea>
                    </div>
                    <button type="submit" className="bg-brand-green text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600">Post Need</button>
                    </form>
                </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Active Needs Column */}
                <div className="bg-blue-50/50 rounded-xl p-4">
                  <h2 className="text-xl font-bold text-blue-800 border-b-2 border-blue-200 pb-2 mb-4">Active Needs</h2>
                  <div className="space-y-3">
                    {activeNeeds.length > 0 ? activeNeeds.map(n => <NeedRow key={n.id} need={n} />) : <p className="text-gray-500 p-4 text-center">No active needs.</p>}
                  </div>
                </div>
                {/* Pending Donations Column */}
                <div className="bg-yellow-50/50 rounded-xl p-4">
                  <h2 className="text-xl font-bold text-yellow-800 border-b-2 border-yellow-200 pb-2 mb-4">Pending Donations</h2>
                  <div className="space-y-3">
                    {pendingNeeds.length > 0 ? pendingNeeds.map(n => <NeedRow key={n.id} need={n} />) : <p className="text-gray-500 p-4 text-center">No pending donations.</p>}
                  </div>
                </div>
                {/* Fulfilled Needs Column */}
                <div className="bg-green-50/50 rounded-xl p-4">
                  <h2 className="text-xl font-bold text-green-800 border-b-2 border-green-200 pb-2 mb-4">Fulfilled Needs</h2>
                  <div className="space-y-3">
                    {fulfilledNeeds.length > 0 ? fulfilledNeeds.map(n => <NeedRow key={n.id} need={n} />) : <p className="text-gray-500 p-4 text-center">No fulfilled needs yet.</p>}
                  </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ShelterDashboardPage;