import React, { useRef, useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { UserOutput } from '@/typings';
import { usePdf } from '@mikecousins/react-pdf';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';

type Props = {
  user: UserOutput;
};

export function RegistrationRequestsFile({ user }: Props) {
  const toast = useRef<Toast>(null);
  const [page, setPage] = useState<number>(1);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');

  useEffect(() => {
    async function fetchPdfUrl() {
      if (user.revenueFileUrl) {
        setLoading(true);
        try {
          const fileRef = ref(storage, user.revenueFileUrl);
          const url = await getDownloadURL(fileRef);
          setFileUrl(url);
        } catch (error) {
          toast.current?.show({
            severity: 'error',
            summary: 'Erreur',
            detail:
              'Une erreur est survenue lors du téléchargement du fichier.',
            life: 3000,
          });
        } finally {
          setLoading(false);
        }
      }
    }

    fetchPdfUrl();
  }, [user.revenueFileUrl]);

  const { pdfDocument } = usePdf({
    file: fileUrl || '',
    page,
    canvasRef,
    scale: 0.4,
    onPageLoadSuccess: () => setLoading(true),
    onPageRenderSuccess: () => setLoading(false),
  });

  const previousDisabled = page === 1;
  const nextDisabled = Boolean(page === pdfDocument?.numPages);

  const openDialog = () => setShowDialog(true);
  const closeDialog = () => setShowDialog(false);

  return (
    <>
      <Card className="p-3">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4">
              Preuve en dossier du chiffre d&apos;affaires
            </h2>
            <p className="text-blue-500 font-semibold mb-4 text-xs transition hover:underline">
              N.B. : Pour zoomer, veuillez cliquer sur le fichier PDF.
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between">
          <Button
            disabled={previousDisabled}
            onClick={() => setPage(page - 1)}
            icon="pi pi-chevron-left"
            rounded
            text
            severity="secondary"
          />
          <div className="flex flex-col justify-center items-center border border-gray-300 rounded-md ">
            {loading && (
              <ProgressSpinner
                style={{ width: '50px', height: '50px' }}
                strokeWidth="4"
                fill="var(--surface-ground)"
              />
            )}
            <div className="cursor-pointer" onClick={openDialog}>
              <canvas ref={canvasRef} className="w-80 h-80 object-fill" />
            </div>
            <p>Page {page}</p>
          </div>
          <Button
            disabled={nextDisabled}
            onClick={() => setPage(page + 1)}
            icon="pi pi-chevron-right"
            rounded
            text
            severity="secondary"
          />
        </div>
      </Card>

      <Dialog
        header="Aperçu du document PDF"
        visible={showDialog}
        style={{ width: '90vw' }}
        onHide={closeDialog}
      >
        <iframe
          src={fileUrl}
          style={{ width: '100%', height: '80vh' }}
          frameBorder="0"
        />
      </Dialog>
      <Toast ref={toast} />
    </>
  );
}
