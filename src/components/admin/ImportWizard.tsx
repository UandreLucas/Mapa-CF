'use client'

import { useState, useRef } from 'react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Download,
  ArrowRight,
  RotateCcw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import type { ImportError } from '@/types'

type Step = 'upload' | 'preview' | 'result'

interface ImportResult {
  total: number
  imported: number
  errors: ImportError[]
}

export function ImportWizard() {
  const { toast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('upload')
  const [filename, setFilename] = useState('')
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [processing, setProcessing] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)

  const reset = () => {
    setStep('upload')
    setRows([])
    setHeaders([])
    setFilename('')
    setResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleFile = async (file: File) => {
    setFilename(file.name)
    const ext = file.name.split('.').pop()?.toLowerCase()

    if (ext === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          const data = res.data as Record<string, unknown>[]
          setRows(data)
          setHeaders(res.meta.fields ?? [])
          setStep('preview')
        },
        error: () =>
          toast({ variant: 'destructive', title: 'Erro ao ler o CSV' }),
      })
    } else if (ext === 'xlsx' || ext === 'xls') {
      const buffer = await file.arrayBuffer()
      const workbook = XLSX.read(buffer, { type: 'array' })
      const sheet = workbook.Sheets[workbook.SheetNames[0]]
      const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: '',
      })
      setRows(data)
      setHeaders(data.length ? Object.keys(data[0]) : [])
      setStep('preview')
    } else {
      toast({
        variant: 'destructive',
        title: 'Formato não suportado',
        description: 'Envie um arquivo .csv ou .xlsx',
      })
    }
  }

  const submit = async () => {
    setProcessing(true)
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename, rows }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResult(data)
      setStep('result')
      toast({
        variant: 'success',
        title: 'Importação concluída',
        description: `${data.imported} imóveis importados.`,
      })
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Erro na importação',
        description: e instanceof Error ? e.message : 'Tente novamente.',
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stepper */}
      <div className="flex items-center gap-2 text-sm">
        {(['upload', 'preview', 'result'] as Step[]).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                step === s
                  ? 'bg-brand-navy text-white'
                  : ['upload', 'preview', 'result'].indexOf(step) > i
                    ? 'bg-brand-gold text-brand-navy'
                    : 'bg-secondary text-muted-foreground'
              }`}
            >
              {i + 1}
            </span>
            <span
              className={
                step === s ? 'font-medium text-foreground' : 'text-muted-foreground'
              }
            >
              {s === 'upload' ? 'Enviar' : s === 'preview' ? 'Conferir' : 'Resultado'}
            </span>
            {i < 2 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* UPLOAD */}
      {step === 'upload' && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0])
            }}
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30 p-12 text-center transition-colors hover:border-brand-gold"
          >
            <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
            <p className="font-medium text-foreground">
              Clique ou arraste a planilha aqui
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Formatos aceitos: CSV, XLSX
            </p>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>

          <div className="mt-4 flex items-center justify-between rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-5 w-5 text-brand-gold" />
              <div>
                <p className="text-sm font-medium">Modelo de importação</p>
                <p className="text-xs text-muted-foreground">
                  Baixe o modelo com as colunas corretas.
                </p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href="/modelo-importacao.csv" download>
                <Download className="h-4 w-4" />
                Baixar modelo
              </a>
            </Button>
          </div>
        </div>
      )}

      {/* PREVIEW */}
      {step === 'preview' && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">{filename}</p>
              <p className="text-sm text-muted-foreground">
                {rows.length} linhas detectadas
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Trocar arquivo
            </Button>
          </div>

          <div className="max-h-96 overflow-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-secondary text-left">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="whitespace-nowrap px-3 py-2 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.slice(0, 20).map((row, i) => (
                  <tr key={i}>
                    {headers.map((h) => (
                      <td
                        key={h}
                        className="max-w-[200px] truncate whitespace-nowrap px-3 py-2 text-muted-foreground"
                      >
                        {String(row[h] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 20 && (
            <p className="mt-2 text-xs text-muted-foreground">
              Mostrando 20 de {rows.length} linhas.
            </p>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={reset}>
              Cancelar
            </Button>
            <Button variant="gold" onClick={submit} disabled={processing}>
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Importando...
                </>
              ) : (
                <>
                  Importar {rows.length} imóveis
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* RESULT */}
      {step === 'result' && result && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex flex-col items-center py-6 text-center">
            <CheckCircle2 className="mb-3 h-14 w-14 text-green-600" />
            <h2 className="font-serif text-2xl font-medium text-brand-navy">
              Importação concluída
            </h2>
            <p className="mt-1 text-muted-foreground">
              {result.imported} de {result.total} imóveis importados com sucesso.
            </p>
          </div>

          {result.errors.length > 0 && (
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-medium text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                {result.errors.length} avisos
              </p>
              <ul className="max-h-40 space-y-1 overflow-auto text-xs text-amber-700">
                {result.errors.map((err, i) => (
                  <li key={i}>
                    {err.row ? `Linha ${err.row}: ` : ''}
                    {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-3">
            <Button variant="outline" onClick={reset}>
              <RotateCcw className="h-4 w-4" />
              Importar outra planilha
            </Button>
            <Button asChild variant="gold">
              <a href="/admin/imoveis">Ver imóveis</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
