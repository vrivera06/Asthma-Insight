import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ProgressBar } from '../components/ProgressBar.jsx'
import { TogglePills } from '../components/TogglePills.jsx'
import { Spinner } from '../components/Spinner.jsx'
import { postJson } from '../lib/api.js'
import './symptomChecker.css'

const yesNoOptions = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
]

const activityOptions = [
  { label: 'Low', value: 'low' },
  { label: 'Moderate', value: 'moderate' },
  { label: 'High', value: 'high' },
]

const stepLabels = ['About you', 'Your environment', 'Your symptoms']

export function SymptomChecker() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    age: '',
    gender: '',
    smokes: '',
    physicalActivity: '',
    pollenExposure: 'no',
    dustExposure: 'no',
    petAllergy: 'no',
    familyHistory: 'no',
    wheezing: 'no',
    shortnessOfBreath: 'no',
    chestTightness: 'no',
    coughing: 'no',
  })

  const isStepValid = useMemo(() => {
    if (step === 1) return form.age !== '' && form.gender !== '' && form.smokes !== '' && form.physicalActivity !== ''
    return true
  }, [form, step])

  function setField(name, value) {
    setError('')
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleFormSubmit(e) {
    // Prevent the browser from submitting the form automatically (e.g. on Enter).
    e.preventDefault()
  }

  async function handleFinalSubmit() {
    if (submitting) return
    setError('')
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        age: Number(form.age),
      }
      const results = await postJson('/api/predict', payload)
      navigate('/results', { state: { results, submitted: payload } })
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page checker">
      <div className="checker-head">
        <h1 className="checker-title">Symptom Checker</h1>
        <p className="checker-subtitle muted">Answer a few questions to estimate your risk.</p>
      </div>

      <div className="checker-card card">
        <ProgressBar step={step} total={3} label={stepLabels[step - 1]} />

        <form onSubmit={handleFormSubmit} className="checker-form">
          <div className={step === 1 ? 'step step-active' : 'step'} aria-hidden={step !== 1}>
            <div className="field">
              <div className="label">Age</div>
              <input
                className="input"
                type="number"
                min={1}
                max={120}
                value={form.age}
                onChange={(e) => setField('age', e.target.value)}
                placeholder="e.g. 24"
                required
                disabled={submitting}
              />
            </div>

            <div className="field">
              <div className="label">Gender</div>
              <select
                className="input"
                value={form.gender}
                onChange={(e) => setField('gender', e.target.value)}
                required
                disabled={submitting}
              >
                <option value="">Select…</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="field">
              <div className="label">Do you smoke?</div>
              <TogglePills
                name="smokes"
                value={form.smokes}
                onChange={setField}
                options={yesNoOptions}
                disabled={submitting}
              />
            </div>

            <div className="field">
              <div className="label">Physical activity</div>
              <TogglePills
                name="physicalActivity"
                value={form.physicalActivity}
                onChange={setField}
                options={activityOptions}
                disabled={submitting}
              />
            </div>
          </div>

          <div className={step === 2 ? 'step step-active' : 'step'} aria-hidden={step !== 2}>
            <div className="field">
              <div className="label">Pollen exposure</div>
              <TogglePills
                name="pollenExposure"
                value={form.pollenExposure}
                onChange={setField}
                options={yesNoOptions}
                disabled={submitting}
              />
            </div>

            <div className="field">
              <div className="label">Dust exposure</div>
              <TogglePills
                name="dustExposure"
                value={form.dustExposure}
                onChange={setField}
                options={yesNoOptions}
                disabled={submitting}
              />
            </div>

            <div className="field">
              <div className="label">Pet allergy</div>
              <TogglePills
                name="petAllergy"
                value={form.petAllergy}
                onChange={setField}
                options={yesNoOptions}
                disabled={submitting}
              />
            </div>

            <div className="field">
              <div className="label">Family history of asthma</div>
              <TogglePills
                name="familyHistory"
                value={form.familyHistory}
                onChange={setField}
                options={yesNoOptions}
                disabled={submitting}
              />
            </div>
          </div>

          <div className={step === 3 ? 'step step-active' : 'step'} aria-hidden={step !== 3}>
            <div className="field">
              <div className="label">Wheezing</div>
              <TogglePills
                name="wheezing"
                value={form.wheezing}
                onChange={setField}
                options={yesNoOptions}
                disabled={submitting}
              />
            </div>

            <div className="field">
              <div className="label">Shortness of breath</div>
              <TogglePills
                name="shortnessOfBreath"
                value={form.shortnessOfBreath}
                onChange={setField}
                options={yesNoOptions}
                disabled={submitting}
              />
            </div>

            <div className="field">
              <div className="label">Chest tightness</div>
              <TogglePills
                name="chestTightness"
                value={form.chestTightness}
                onChange={setField}
                options={yesNoOptions}
                disabled={submitting}
              />
            </div>

            <div className="field">
              <div className="label">Coughing</div>
              <TogglePills
                name="coughing"
                value={form.coughing}
                onChange={setField}
                options={yesNoOptions}
                disabled={submitting}
              />
            </div>
          </div>

          {error ? <div className="error">{error}</div> : null}

          <div className="checker-actions">
            <button
              type="button"
              className="btn"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={submitting || step === 1}
            >
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep((s) => Math.min(3, s + 1))}
                disabled={submitting || !isStepValid}
              >
                Next
              </button>
            ) : (
              <button type="button" className="btn btn-primary" disabled={submitting} onClick={handleFinalSubmit}>
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
            )}

            {submitting ? <Spinner label="Analyzing" /> : null}
          </div>
        </form>
      </div>
    </div>
  )
}

