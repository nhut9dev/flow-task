import { useToastContext } from '~components/ui/toast-provider';

export function useToast() {
  const { showToast } = useToastContext();
  return showToast;
}
