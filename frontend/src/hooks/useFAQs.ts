import { useQuery, useMutation, useQueryClient } from 'react-query';
import { faqApi } from '@/utils/api';
import { FAQ, FAQCreateData, FAQUpdateData } from '@/types';
import toast from 'react-hot-toast';

export const useFAQs = () => {
  const queryClient = useQueryClient();

  const {
    data: faqs,
    isLoading,
    error,
    refetch,
  } = useQuery<FAQ[]>(
    'faqs',
    () => faqApi.getFAQs().then(res => res.data),
    {
      onError: () => {
        toast.error('Failed to load FAQs');
      },
    }
  );

  const createFAQMutation = useMutation(
    (faqData: FAQCreateData) => faqApi.createFAQ(faqData),
    {
      onSuccess: (response) => {
        queryClient.setQueryData('faqs', (old: FAQ[] | undefined) => 
          old ? [...old, response.data] : [response.data]
        );
        toast.success('FAQ created successfully');
      },
      onError: () => {
        toast.error('Failed to create FAQ');
      },
    }
  );

  const createFAQsBulkMutation = useMutation(
    (faqs: FAQCreateData[]) => faqApi.createFAQsBulk(faqs),
    {
      onSuccess: (response) => {
        queryClient.setQueryData('faqs', (old: FAQ[] | undefined) => 
          old ? [...old, ...response.data] : response.data
        );
        toast.success(`${response.data.length} FAQs created successfully`);
      },
      onError: () => {
        toast.error('Failed to create FAQs');
      },
    }
  );

  const uploadCSVMutation = useMutation(
    (file: File) => faqApi.uploadFAQsCSV(file),
    {
      onSuccess: (response) => {
        queryClient.setQueryData('faqs', (old: FAQ[] | undefined) => 
          old ? [...old, ...response.data] : response.data
        );
        toast.success(`${response.data.length} FAQs uploaded successfully`);
      },
      onError: () => {
        toast.error('Failed to upload CSV file');
      },
    }
  );

  const updateFAQMutation = useMutation(
    ({ id, data }: { id: number; data: FAQUpdateData }) => 
      faqApi.updateFAQ(id, data),
    {
      onSuccess: (response) => {
        queryClient.setQueryData('faqs', (old: FAQ[] | undefined) => 
          old ? old.map(faq => faq.id === response.data.id ? response.data : faq) : [response.data]
        );
        toast.success('FAQ updated successfully');
      },
      onError: () => {
        toast.error('Failed to update FAQ');
      },
    }
  );

  const deleteFAQMutation = useMutation(
    (id: number) => faqApi.deleteFAQ(id),
    {
      onSuccess: (_, id) => {
        queryClient.setQueryData('faqs', (old: FAQ[] | undefined) => 
          old ? old.filter(faq => faq.id !== id) : []
        );
        toast.success('FAQ deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete FAQ');
      },
    }
  );

  const testFAQMatchMutation = useMutation(
    (message: string) => faqApi.testFAQMatch(message),
    {
      onError: () => {
        toast.error('Failed to test FAQ match');
      },
    }
  );

  return {
    faqs,
    isLoading,
    error,
    refetch,
    createFAQ: createFAQMutation.mutate,
    createFAQsBulk: createFAQsBulkMutation.mutate,
    uploadCSV: uploadCSVMutation.mutate,
    updateFAQ: updateFAQMutation.mutate,
    deleteFAQ: deleteFAQMutation.mutate,
    testFAQMatch: testFAQMatchMutation.mutate,
    isCreating: createFAQMutation.isLoading,
    isCreatingBulk: createFAQsBulkMutation.isLoading,
    isUploading: uploadCSVMutation.isLoading,
    isUpdating: updateFAQMutation.isLoading,
    isDeleting: deleteFAQMutation.isLoading,
    isTesting: testFAQMatchMutation.isLoading,
    testResult: testFAQMatchMutation.data?.data,
  };
};
