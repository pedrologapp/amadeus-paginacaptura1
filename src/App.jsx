import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { CheckCircle, Plus, ArrowLeft, ArrowRight, MessageCircle, Download, Share2 } from 'lucide-react'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [utmParams, setUtmParams] = useState({})
  
  // Estados do formulário
  const [responsible, setResponsible] = useState({
    nome: '',
    celular: '',
    email: ''
  })
  const [students, setStudents] = useState([
    { nome: '', serie: '', turno: '' }
  ])
  const [consents, setConsents] = useState({
    receberConteudos: false,
    agendarWhatsApp: true
  })
  const [errors, setErrors] = useState({})

  // Capturar parâmetros UTM na inicialização
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const utm = {
      source: urlParams.get('utm_source') || '',
      medium: urlParams.get('utm_medium') || '',
      campaign: urlParams.get('utm_campaign') || '',
      content: urlParams.get('utm_content') || '',
      term: urlParams.get('utm_term') || ''
    }
    setUtmParams(utm)
  }, [])

  const serieOptions = [
    'Maternal II', 'Maternal III', 'Grupo IV', 'Grupo V',
    '1º ano', '2º ano', '3º ano', '4º ano', '5º ano',
    '6º ano', '7º ano', '8º ano', '9º ano'
  ]


  const turnoOptions = ['Matutino', 'Vespertino']

  const addStudent = () => {
    if (students.length < 3) {
      setStudents([...students, { nome: '', serie: '', turno: '' }])
    }
  }

  const removeStudent = (index) => {
    if (students.length > 1) {
      setStudents(students.filter((_, i) => i !== index))
    }
  }

  const updateStudent = (index, field, value) => {
    const newStudents = [...students]
    newStudents[index][field] = value
    setStudents(newStudents)
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4')
    }
    return value
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      // Validação dos dados do responsável
      if (!responsible.nome.trim()) {
        newErrors.responsible_nome = 'Nome é obrigatório'
      }
      if (!responsible.celular.trim()) {
        newErrors.responsible_celular = 'Celular é obrigatório'
      } else if (responsible.celular.replace(/\D/g, '').length !== 11) {
        newErrors.responsible_celular = 'Celular deve ter 11 dígitos'
      }
     /* if (!responsible.email.trim()) {
        newErrors.responsible_email = 'E-mail é obrigatório'
      } else if (!/\S+@\S+\.\S+/.test(responsible.email)) {
        newErrors.responsible_email = 'E-mail inválido'
      }
      */
    }
    
    if (step === 2) {
      // Validação dos dados dos estudantes
      students.forEach((student, index) => {
        if (!student.nome.trim()) {
          newErrors[`student_${index}_nome`] = 'Nome é obrigatório'
        }
        if (!student.serie) {
          newErrors[`student_${index}_serie`] = 'Série pretendida é obrigatória'
        }
        if (!student.turno) {
          newErrors[`student_${index}_turno`] = 'Turno pretendido é obrigatório'
        }
      })
    }
    
    if (step === 3) {
      // Validação dos consentimentos
      if (!consents.agendarWhatsApp) {
        newErrors.agendarWhatsApp = 'É necessário aceitar o agendamento via WhatsApp'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Função para enviar dados do responsável para validação no n8n
  const validateResponsibleWithN8n = async () => {
    const responsibleData = {
      timestamp: new Date().toISOString(),
      responsavel: responsible,
      utm: utmParams,
      origem: 'site_captacao',
      etapa: 'validacao_responsavel'
    }
    
    try {
      // TODO: Substituir WEBHOOK_N8N_VALIDACAO_URL pela URL real do webhook de validação
      console.log('Dados do responsável enviados para validação:', responsibleData)
      
      // Simular delay de validação
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simular sucesso na validação
      return true
      
      // Código real para produção:
      const response = await fetch('https://n8n.escolaamadeus.com/webhook-test/eduhubamadeus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responsibleData)
      })
      
      if (response.ok) {
        const result = await response.json()
        // Verificar se o WhatsApp é válido baseado na resposta do n8n
        return result.whatsappValido === true
      } else {
        throw new Error('Erro na validação')
      }
      
    } catch (error) {
      console.error('Erro na validação:', error)
      return false
    }
  }

  const nextStep = async () => {
    if (!validateStep(currentStep)) return
    
    // Se estiver na etapa 1 (dados do responsável), validar com n8n
    if (currentStep === 1) {
      setIsSubmitting(true)
      
      try {
        const isValid = await validateResponsibleWithN8n()
        
        if (isValid) {
          if (window.fbq) {
            window.fbq('track', 'Lead')
          }
          setCurrentStep(currentStep + 1)
        } else {
          alert('Não foi possível validar o número do WhatsApp. Verifique se o número está correto e tente novamente.')
        }
      } catch (error) {
        alert('Erro na validação. Tente novamente ou entre em contato pelo WhatsApp.')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Para outras etapas, avançar normalmente
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const submitForm = async () => {
    if (!validateStep(3)) return
    
    setIsSubmitting(true)
    
    const formData = {
      timestamp: new Date().toISOString(),
      responsavel: responsible,
      estudantes: students,
      consentimentos: consents,
      utm: utmParams,
      origem: 'site_captacao'
    }
    
    try {
      // Simulação para demonstração - TODO: Substituir WEBHOOK_N8N_URL pela URL real do n8n
      console.log('Dados finais enviados para o n8n:', formData)
      
      // Simular delay de envio
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simular sucesso
      if (window.fbq) {
        window.fbq('track', 'CompleteRegistration')
      }
      setIsSuccess(true)
      
   /*
      const response = await fetch('WEBHOOK_N8N_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        if (window.fbq) {
          window.fbq('track', 'CompleteRegistration')
        }
        setIsSuccess(true)
      } else {
        throw new Error('Erro no envio')
      }

      */
    } catch (error) {
      alert('Ops! Algo deu errado. Tente novamente ou entre em contato pelo WhatsApp.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getProgressPercentage = () => {
    return (currentStep / 3) * 100
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl mx-auto backdrop-blur-sm bg-white/90 border-0 shadow-2xl rounded-3xl">
          <CardContent className="p-8 text-center space-y-6">
            <div className="animate-bounce">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-3xl font-bold text-gray-800">
                Recebido com sucesso! 🎉
              </h1>
              <p className="text-xl text-gray-600">
                Obrigado pelo interesse no Centro Educacional Amadeus! Estamos ansiosos para recebê-lo(a).
              </p>
              <p className="text-gray-500">
                Nossa equipe entrará em contato em breve para agendar sua visita.
              </p>
            </div>

            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg rounded-2xl"
                onClick={() => window.open('https://wa.me/5584981450229?text=Olá! Acabei de preencher o formulário de interesse no Colégio Amadeus e gostaria de agendar minha visita', '_blank')}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                📱 Agendar Agora pelo WhatsApp
              </Button>             
            </div>
            {/* 
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Enquanto isso, conheça mais sobre o Colégio Amadeus
              </h3>
              <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
                {/* TODO: Inserir vídeo institucional do YouTube/Vimeo 
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Vídeo Institucional
                </div>
              </div>
          
            </div>
  */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Compartilhe com outros pais</p>
              <div className="flex justify-center space-x-4">
                <Button variant="ghost" size="sm" className="text-blue-600">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button 
              variant="link" 
              className="text-blue-600 hover:text-blue-800"
              onClick={() => {/* TODO: Inserir URL do site do colégio */}}
            >
              ← Voltar ao site do Colégio Amadeus
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header fixo */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* TODO: Inserir logo do Colégio Amadeus aqui */}
         <img 
              src="/logo-colegio-amadeus.png" 
              alt="Colégio Amadeus" 
              className="w-12 h-12 object-contain"
            />
            {/* <span className="text-xl font-bold text-gray-800">Centro Educacional Amadeus</span> */}
          </div>
          
          {/* Indicador de progresso */}
          <div className="flex items-center space-x-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className={`w-8 h-1 mx-1 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
        
        <Progress value={getProgressPercentage()} className="h-1" />
      </header>

      {/* Conteúdo principal */}
      <main className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="text-center space-y-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
              {/* Headline principal */}
              <div className="space-y-3">
                <CardTitle className="text-3xl md:text-4xl font-bold leading-tight">
                  Seu filho não é apenas mais um aluno.
                </CardTitle>
                <p className="text-xl md:text-2xl font-semibold text-blue-50">
                  Ele é único. E merece ser tratado assim.
                </p>
              </div>
              
              {/* Lema com destaque */}
              <div className="border-t border-b border-white/30 py-4 my-4">
                <p className="text-lg md:text-xl font-medium text-yellow-300">
                  Escola Amadeus: Onde Cada Aluno Importa!
                </p>
              </div>
              
              {/* CTA */}
              <p className="text-blue-100 text-base">
                Agende sua visita agora para a "Experiência Amadeus"
              </p>
            </CardHeader>

            <CardContent className="p-8">
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Dados do Responsável
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="responsible-nome">Nome completo *</Label>
                      <Input
                        id="responsible-nome"
                        value={responsible.nome}
                        onChange={(e) => setResponsible({...responsible, nome: e.target.value})}
                        className="mt-1 rounded-xl"
                        placeholder="Digite seu nome completo"
                      />
                      {errors.responsible_nome && (
                        <p className="text-red-500 text-sm mt-1">{errors.responsible_nome}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="responsible-celular">Celular *</Label>
                      <Input
                        id="responsible-celular"
                        type="tel"
                        value={responsible.celular}
                        onChange={(e) => setResponsible({...responsible, celular: formatPhone(e.target.value)})}
                        className="mt-1 rounded-xl"
                        placeholder="(84) 9 9999-9999"
                      />
                      {errors.responsible_celular && (
                        <p className="text-red-500 text-sm mt-1">{errors.responsible_celular}</p>
                      )}
                    </div>
                   {/* 
                    <div>
                      <Label htmlFor="responsible-email">E-mail *</Label>
                      <Input
                        id="responsible-email"
                        type="email"
                        value={responsible.email}
                        onChange={(e) => setResponsible({...responsible, email: e.target.value})}
                        className="mt-1 rounded-xl"
                        placeholder="seu@email.com"
                      />
                      {errors.responsible_email && (
                        <p className="text-red-500 text-sm mt-1">{errors.responsible_email}</p>
                      )}
                    </div>
                   */}
                  </div>
                </div>
              )}
              
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Dados do(s) Estudante(s)
                  </h3>
                  
                  {students.map((student, index) => (
                    <Card key={index} className="p-6 border-2 border-gray-100 rounded-2xl">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-gray-700">
                          Estudante {index + 1}
                        </h4>
                        {students.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStudent(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remover
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`student-${index}-nome`}>Nome completo *</Label>
                          <Input
                            id={`student-${index}-nome`}
                            value={student.nome}
                            onChange={(e) => updateStudent(index, 'nome', e.target.value)}
                            className="mt-1 rounded-xl"
                            placeholder="Digite o nome completo do estudante"
                          />
                          {errors[`student_${index}_nome`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`student_${index}_nome`]}</p>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`student-${index}-serie`}>Série pretendida *</Label>
                            <Select onValueChange={(value) => updateStudent(index, 'serie', value)}>
                              <SelectTrigger className="mt-1 rounded-xl">
                                <SelectValue placeholder="Selecione a série pretendida" />
                              </SelectTrigger>
                              <SelectContent>
                                {serieOptions.map((serie) => (
                                  <SelectItem key={serie} value={serie}>{serie}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors[`student_${index}_serie`] && (
                              <p className="text-red-500 text-sm mt-1">{errors[`student_${index}_serie`]}</p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor={`student-${index}-turno`}>Turno pretendido *</Label>
                            <Select onValueChange={(value) => updateStudent(index, 'turno', value)}>
                              <SelectTrigger className="mt-1 rounded-xl">
                                <SelectValue placeholder="Selecione o turno pretendido" />
                              </SelectTrigger>
                              <SelectContent>
                                {turnoOptions.map((turno) => (
                                  <SelectItem key={turno} value={turno}>{turno}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors[`student_${index}_turno`] && (
                              <p className="text-red-500 text-sm mt-1">{errors[`student_${index}_turno`]}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  {students.length < 3 && (
                    <Button
                      variant="outline"
                      onClick={addStudent}
                      className="w-full border-2 border-dashed border-gray-300 hover:border-blue-400 text-gray-600 hover:text-blue-600 py-4 rounded-2xl"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Adicionar outro estudante
                    </Button>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Confirmação e Consentimento
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="receberConteudos"
                        checked={consents.receberConteudos}
                        onCheckedChange={(checked) => setConsents({...consents, receberConteudos: checked})}
                        className="mt-1"
                      />
                      <Label htmlFor="receberConteudos" className="text-sm leading-relaxed">
                        Quero receber conteúdos exclusivos e informações sobre o Colégio Amadeus, de acordo com a{' '}
                        <a href="#" className="text-blue-600 underline hover:text-blue-800">
                          Política de Privacidade
                        </a>
                      </Label>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agendarWhatsApp"
                        checked={consents.agendarWhatsApp}
                        onCheckedChange={(checked) => setConsents({...consents, agendarWhatsApp: checked})}
                        className="mt-1"
                      />
                      <Label htmlFor="agendarWhatsApp" className="text-sm leading-relaxed font-medium">
                        Quero agendar minha visita pelo WhatsApp *
                      </Label>
                    </div>
                    {errors.agendarWhatsApp && (
                      <p className="text-red-500 text-sm">{errors.agendarWhatsApp}</p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-2xl">
                    <p className="text-sm text-blue-800">
                      Após o envio, entraremos em contato para confirmar todos os detalhes.
                    </p>
                  </div>
                </div>
              )}

              {/* Botões de navegação */}
              <div className="flex justify-between pt-8">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    className="px-8 py-3 rounded-2xl border-gray-300 text-gray-600 hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    RETROCEDER
                  </Button>
                )}
                
                <div className="ml-auto">
                  {currentStep < 3 ? (
                    <Button
                      onClick={nextStep}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl"
                    >
                      {isSubmitting && currentStep === 1 ? 'Validando...' : 'AVANÇAR'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={submitForm}
                      disabled={isSubmitting}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-2xl text-lg font-semibold"
                    >
                      {isSubmitting ? 'Enviando...' : 'CONCLUIR'}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Botão flutuante do WhatsApp */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => window.open('https://wa.me/5584981450229?text=Olá! Gostaria de saber mais sobre o Colégio Amadeus', '_blank')}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg animate-pulse"
          title="Fale conosco agora"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}

export default App
