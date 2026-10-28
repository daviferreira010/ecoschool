/* =====================================================================
   forms.js — VALIDAÇÃO DE FORMULÁRIOS (contato, ouvidoria, etc.)
   ---------------------------------------------------------------------
   Uso:  Forms.attach(formElement, { onValid(dados, form) {...} })

   Regras lidas do próprio HTML:
     required, type="email", minlength, maxlength,
     data-validate="phone", data-mask="phone"
   Também há um campo "honeypot" (name="website") escondido: robôs
   costumam preenchê-lo; pessoas não. Se vier preenchido, o envio é ignorado.

   ⚠️ A validação no navegador melhora a experiência, mas NÃO é segurança.
      O backend deve validar e sanitizar novamente todos os campos,
      limitar a taxa de envios (rate limit) e usar CAPTCHA se necessário.
   ===================================================================== */
const Forms = (() => {
  'use strict';
  const { qs, qsa, sanitizeText, validators, maskPhone, escapeHTML } = Utils;

  const MSG = {
    required: 'Este campo é obrigatório.',
    email: 'Informe um e-mail válido (ex.: nome@dominio.com).',
    phone: 'Informe um telefone com DDD (10 ou 11 dígitos).',
    minlength: (n) => `Digite pelo menos ${n} caracteres.`,
    checkbox: 'É preciso marcar esta opção para continuar.'
  };

  function errorEl(field) {
    let el = qs(`#${field.id}-error`);
    if (!el) {
      el = document.createElement('p');
      el.id = `${field.id}-error`;
      el.className = 'field__error';
      el.setAttribute('aria-live', 'polite');
      const holder = field.closest('.field, .check') || field.parentElement;
      holder.appendChild(el);
      const describedBy = (field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (!describedBy.includes(el.id)) field.setAttribute('aria-describedby', [...describedBy, el.id].join(' '));
    }
    return el;
  }

  function validateField(field) {
    if (field.disabled || field.type === 'hidden' || field.type === 'file' || field.name === 'website') return true;

    // Grupo de opções (radio): pelo menos uma marcada
    if (field.type === 'radio') {
      const group = qsa(`input[type="radio"][name="${field.name}"]`, field.form);
      const ok = !group.some((r) => r.required) || group.some((r) => r.checked);
      const holder = field.closest('fieldset') || field.parentElement;
      let err = qs(`#${field.name}-group-error`);
      if (!err) {
        err = document.createElement('p');
        err.id = `${field.name}-group-error`;
        err.className = 'field__error';
        err.setAttribute('aria-live', 'polite');
        holder.appendChild(err);
        group.forEach((r) => r.setAttribute('aria-describedby', err.id));
      }
      err.textContent = ok ? '' : 'Escolha uma das opções.';
      group.forEach((r) => r.setAttribute('aria-invalid', ok ? 'false' : 'true'));
      holder.classList.toggle('has-error', !ok);
      return ok;
    }

    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    let message = '';
    if (field.required && (field.type === 'checkbox' ? !value : !value)) {
      message = field.type === 'checkbox' ? MSG.checkbox : MSG.required;
    } else if (value && field.type === 'email' && !validators.email(value)) {
      message = MSG.email;
    } else if (value && field.dataset.validate === 'phone' && !validators.phone(value)) {
      message = MSG.phone;
    } else if (value && field.minLength > 0 && String(value).length < field.minLength) {
      message = MSG.minlength(field.minLength);
    }
    const err = errorEl(field);
    err.textContent = message;
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    (field.closest('.field, .check') || field).classList.toggle('has-error', !!message);
    return !message;
  }

  function collect(form) {
    const data = {};
    qsa('input, select, textarea', form).forEach((f) => {
      if (!f.name || f.name === 'website') return;
      if (f.type === 'checkbox') data[f.name] = f.checked;
      else if (f.type === 'radio') { if (f.checked) data[f.name] = sanitizeText(f.value, 200); }
      else data[f.name] = sanitizeText(f.value, Number(f.maxLength) > 0 ? f.maxLength : 5000);
    });
    return data;
  }

  function attach(form, { onValid } = {}) {
    if (!form || form.dataset.formReady) return;
    form.dataset.formReady = 'true';
    form.setAttribute('novalidate', '');

    // máscara de telefone
    qsa('[data-mask="phone"]', form).forEach((f) => f.addEventListener('input', () => { f.value = maskPhone(f.value); }));

    // contador de caracteres
    qsa('textarea[maxlength]', form).forEach((ta) => {
      const counter = document.createElement('span');
      counter.className = 'field__counter';
      counter.setAttribute('aria-hidden', 'true');
      const update = () => { counter.textContent = `${ta.value.length}/${ta.maxLength}`; };
      ta.closest('.field').appendChild(counter);
      ta.addEventListener('input', update);
      update();
    });

    // validação ao sair do campo e ao corrigir
    qsa('input, select, textarea', form).forEach((f) => {
      f.addEventListener('blur', () => validateField(f));
      f.addEventListener('input', () => { if (f.getAttribute('aria-invalid') === 'true') validateField(f); });
      f.addEventListener('change', () => { if (f.type === 'checkbox' || f.type === 'radio' || f.tagName === 'SELECT') validateField(f); });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = qsa('input, select, textarea', form);
      const results = fields.map(validateField);
      if (results.includes(false)) {
        const firstInvalid = fields.find((f) => f.getAttribute('aria-invalid') === 'true');
        firstInvalid && firstInvalid.focus();
        Utils.toast('Revise os campos destacados.', 'warning');
        return;
      }
      const honeypot = qs('[name="website"]', form);
      if (honeypot && honeypot.value) return; // provável robô: ignora em silêncio
      onValid && onValid(collect(form), form);
    });

    form.addEventListener('reset', () => {
      setTimeout(() => {
        qsa('.field__error', form).forEach((el) => { el.textContent = ''; });
        qsa('[aria-invalid]', form).forEach((el) => el.setAttribute('aria-invalid', 'false'));
        qsa('.has-error', form).forEach((el) => el.classList.remove('has-error'));
        qsa('textarea[maxlength]', form).forEach((ta) => ta.dispatchEvent(new Event('input')));
      });
    });
  }

  /* Mensagem exibida após validação bem-sucedida.
     NÃO afirmamos que a mensagem foi enviada: ainda não há backend. */
  function showBackendNotice(form, data, { titulo = 'Formulário validado' } = {}) {
    const box = qs('.form-result', form.parentElement) || document.createElement('div');
    box.className = 'form-result';
    box.setAttribute('role', 'status');
    box.setAttribute('tabindex', '-1');
    const resumo = Object.entries(data)
      .filter(([k, v]) => typeof v === 'string' && v && k !== 'mensagem')
      .map(([k, v]) => `<li><strong>${escapeHTML(k)}:</strong> ${escapeHTML(v)}</li>`).join('');
    box.innerHTML = `
      <div class="form-result__icon"><i class="fa-solid fa-server" aria-hidden="true"></i></div>
      <div>
        <h3>${escapeHTML(titulo)} — mas ainda não enviado</h3>
        <p>Os dados estão corretos, porém <strong>esta versão do site ainda não possui servidor (backend)</strong>.
           Por isso a mensagem <strong>não foi enviada</strong> para a escola. Para falar com a escola agora,
           use os canais oficiais da página de contato.</p>
        ${resumo ? `<details><summary>Ver dados que seriam enviados</summary><ul>${resumo}</ul></details>` : ''}
        <p class="form-result__dev"><i class="fa-solid fa-code" aria-hidden="true"></i> Desenvolvedor: implemente a rota <code>POST ${escapeHTML(form.dataset.endpoint || '/api/...')}</code> (veja backend/README.md).</p>
      </div>`;
    if (!box.parentElement) form.insertAdjacentElement('afterend', box);
    box.focus();
  }

  return { attach, validateField, collect, showBackendNotice };
})();
